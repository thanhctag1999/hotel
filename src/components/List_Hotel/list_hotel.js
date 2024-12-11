import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material"; // Import necessary components
import Rating from "@mui/material/Rating";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import locationIcon from "../../assests/icons/location.png"; // Changed variable name to avoid conflict
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  position: "relative",
  overflow: "hidden",
  height: "250px", // Set a fixed height for the Item
}));

const ImageContainer = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
});

const OverlayText = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "10px",
  left: "10px",
  color: "#fff",
  zIndex: 2,
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for text
  padding: "5px 10px",
  borderRadius: "5px",
  ...theme.typography.subtitle1,
}));

export default function List_Hotel() {
  const API_URL = process.env.REACT_APP_API;
  const [hotels, setHotels] = useState([]);
  const [locations, setLocations] = useState([]); // Store locations as an array
  const [loading, setLoading] = useState(true); // State for loading
  const [filterText, setFilterText] = useState(""); // State for filter text
  const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location
  const [ratingFilter, setRatingFilter] = useState(0); // State for rating filter

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 4; // Items per page

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/hotel/list-all`);
        setHotels(response.data.data);
      } catch (error) {
        console.error("There was an error fetching the hotels!", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/location/list-all`);
        if (response.status === 200) {
          setLocations(response.data.data); // Set the data in state
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchHotels(), fetchLocations()]); // Fetch both data
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, []);

  // Function to get the location name by its ID
  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown location"; // Return the name or fallback
  };

  // Filter hotels based on the filter text, selected location, and rating filter
  const filteredHotels = hotels.filter((hotel) => {
    const hotelName = hotel.hotel_name.toLowerCase();
    const hotelDescription = hotel.description.toLowerCase();
    const locationMatches = selectedLocation
      ? hotel.location === selectedLocation
      : true;

    // Exact star rating match (if ratingFilter is selected)
    const ratingMatches =
      ratingFilter > 0 ? parseFloat(hotel.rating) === ratingFilter : true;

    return (
      (hotelName.includes(filterText.toLowerCase()) ||
        hotelDescription.includes(filterText.toLowerCase())) &&
      locationMatches &&
      ratingMatches
    );
  });

  // Pagination logic
  const totalItems = filteredHotels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="page-hotel">
      <h2>
        <FormattedMessage id="hot_booking" defaultMessage="hot_booking" />
      </h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <TextField
          className="seachInput"
          variant="outlined"
          placeholder="Filter by hotel name or description"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)} // Update filter text on input change
          fullWidth
        />

        <FormControl fullWidth>
          <Autocomplete
            options={locations}
            getOptionLabel={(option) => option.name || ""}
            value={locations.find((loc) => loc.id === selectedLocation) || null}
            onChange={(event, newValue) =>
              setSelectedLocation(newValue ? newValue.id : "")
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="All Locations" />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Select
            labelId="rating-select-label"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)} // Update rating filter
            displayEmpty
          >
            <MenuItem value={0}>All Ratings</MenuItem>
            <MenuItem value={1}>1 Star</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
          </Select>
        </FormControl>
      </div>

      {paginatedHotels.map((hotel) => (
        <Link
          className="hotel-list-item"
          to={`/hotel_detail/${hotel.id}`}
          key={hotel.id}
        >
          <div className="list-hotel-item">
            <div className="flex-hotel">
              <img
                className="list-hotel-img"
                src={`${API_URL}/${hotel.image_path}`}
                alt={hotel.hotel_name}
                onError={(e) => {
                  e.target.src =
                    "https://grandtouranehotel.com/uploads/product/sp_55.jpg";
                }}
              />

              <div className="list-hotel-contain">
                <h4>{hotel.hotel_name}</h4>
                <div className="location">
                  <img
                    className="icon"
                    src={locationIcon}
                    alt="Location Icon"
                  />
                  {/* Display the location name using the ID from hotel */}
                  <p>{getLocationName(hotel.location)}</p>
                </div>
                <Rating
                  name={`rating-${hotel.id}`}
                  value={parseFloat(hotel.rating)}
                  readOnly
                />
                <p className="list-hotel-desc">{hotel.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Pagination Controls */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          {"<"}
        </Button>
        <span style={{ margin: "10px 10px" }}>
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          {">"}
        </Button>
      </div>

      <Box sx={{ flexGrow: 1, marginTop: "30px", margin: "50px" }}>
        <h2>
          <FormattedMessage id="trending" defaultMessage="trending" />
        </h2>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Item
              onClick={() => {
                setSelectedLocation(11);
              }}
            >
              <ImageContainer
                style={{
                  backgroundImage:
                    'url("https://file3.qdnd.vn/data/images/0/2022/10/24/phucthang/hanoi%20trong%20toi1.jpg?dpi=150&quality=100&w=870")',
                }}
              />
              <OverlayText>Hà Nội</OverlayText>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item
              onClick={() => {
                setSelectedLocation(59);
              }}
            >
              <ImageContainer
                style={{
                  backgroundImage:
                    'url("https://www.vietnam-briefing.com/news/wp-content/uploads/2018/07/Vietnam-Briefing-Vietnams-Economy-in-the-in-the-first-half-of-2018.jpg")',
                }}
              />
              <OverlayText>Hồ Chí Minh</OverlayText>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item
              onClick={() => {
                setSelectedLocation(21);
              }}
            >
              <ImageContainer
                style={{
                  backgroundImage:
                    'url("https://vcdn1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg")',
                }}
              />
              <OverlayText>Đà Nẵng</OverlayText>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item
              onClick={() => {
                setSelectedLocation(38);
              }}
            >
              <ImageContainer
                style={{
                  backgroundImage:
                    'url("https://www.agoda.com/wp-content/uploads/2024/03/Cai-Rang-Can-Tho-1244x700.jpg")',
                }}
              />
              <OverlayText>Cần Thơ</OverlayText>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item
              onClick={() => {
                setSelectedLocation(39);
              }}
            >
              <ImageContainer
                style={{
                  backgroundImage:
                    'url("https://file1.dangcongsan.vn/data/0/images/2024/04/11/upload_673/hue-imperial-gate-1024x683-754-17016811818591749547652.png")',
                }}
              />
              <OverlayText>Huế</OverlayText>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
