import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Stack,
  Grid,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useParams } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import "../css/hotel_detail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HotelDetail = () => {
  const { hotel_id } = useParams();
  const [numPeople, setNumPeople] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [comments, setComments] = useState([]);
  const [hotel, setHotel] = useState({});
  const [service, setService] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    // Convert price to a number  andformat it
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "")
      .trim();
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api-tltn.onrender.com/api/v1/hotel/findById/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setHotel(response.data.data); // Store the hotel object directly
        } else {
          setHotel({});
        }
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the hotel details!", error);
        setLoading(false);
      }
    };

    const fetchService = async () => {
      try {
        const response = await axios.get(
          `https://api-tltn.onrender.com/api/v1/service/findByHotelId/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setService(response.data.data); // Store service array
        } else {
          setService([]);
        }
      } catch (error) {
        console.error("There was an error fetching the services!", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://api-tltn.onrender.com/api/v1/comment/getCommentByHotelId/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setComments(response.data.data);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("There was an error fetching the comments!", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `https://api-tltn.onrender.com/api/v1/room/getRoomsByHotelId/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setRooms(response.data.data);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("There was an error fetching the comments!", error);
      }
    };

    fetchDetail();
    fetchService();
    fetchRooms();
    fetchComments();
  }, [hotel_id]);

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    calculatePrice();
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, { user: "You", text: newComment }]);
      setNewComment("");
    }
  };

  const handleQuantityChange = (event) => {
    setNumPeople(event.target.value);
    calculatePrice();
  };

  const handleCheckInDateChange = (event) => {
    setCheckInDate(event.target.value);
    calculatePrice();
  };

  const handleCheckOutDateChange = (event) => {
    setCheckOutDate(event.target.value);
    calculatePrice();
  };

  const calculatePrice = () => {
    // Find the price of the selected room
    const roomPrice = rooms.find((room) => room.id === selectedRoom)?.price;

    // Return 0 if the selected room is not found
    if (!roomPrice) return 0;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Calculate the difference in time
    const timeDiff = end - start;

    // Convert time difference from milliseconds to days
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Calculate and return the total price
    setTotalPrice(days * roomPrice);
  };

  const handleBooking = async () => {
    if (localStorage.getItem("userId") !== null) {
      try {
        setLoading(true);
        const body = {
          user_id: localStorage.getItem("userId"),
          room_id: selectedRoom,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_price: totalPrice,
          people: numPeople,
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://api-tltn.onrender.com/api/v1/booking/createboking",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set Authorization header
            },
          }
        );

        if (response && response.status === 201) {
          toast.success("Booking successful");
        } else {
          toast.error("Booking failed. Please try again.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error("Booking failed. Please try again later.");
        }
      }
    } else {
      toast.error("Please login before booking");
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // Center horizontally
            margin: "0 auto",
            padding: 2,
            marginTop: "20%",
            width: "fit-content", // Ensures box size fits content
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: 2,
          }}
        >
          <ToastContainer />
          <Grid container spacing={2}>
            {/* Left side - Hotel Information */}
            <Grid item xs={8}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <>
                  <Typography variant="h3" gutterBottom>
                    {hotel.hotelName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Address:</strong> {hotel.address}
                  </Typography>

                  {/* Hotel Image */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      my: 2,
                    }}
                  >
                    <img
                      src={hotel.imageHotel}
                      alt={hotel.hotelName}
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  </Box>

                  <Typography variant="body1" paragraph>
                    {hotel.description}
                  </Typography>

                  {/* Services */}
                  <Typography variant="h6">Services</Typography>
                  <List>
                    {service.map((serviceItem, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={serviceItem.service_name} />
                      </ListItem>
                    ))}
                  </List>
                </>
              </Paper>
            </Grid>

            {/* Right side - Room Selection */}
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <>
                  <h5>Booking</h5>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Room Number</InputLabel>
                    <Select
                      value={selectedRoom}
                      onChange={handleRoomChange}
                      label="Room Number"
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.room_number} - {formatPrice(room.price)} VND
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Quantity of People</InputLabel>
                    <Select
                      value={numPeople}
                      onChange={handleQuantityChange}
                      label="Quantity of People"
                    >
                      {[1, 2, 3, 4].map((quantity) => (
                        <MenuItem key={quantity} value={quantity}>
                          {quantity} {quantity > 1 ? "people" : "person"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Check-in Date"
                    type="date"
                    value={checkInDate}
                    onChange={handleCheckInDateChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    label="Check-out Date"
                    type="date"
                    value={checkOutDate}
                    onChange={handleCheckOutDateChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <br />

                  <Typography fullWidth sx={{ mt: 2 }} variant="h6">
                    Tổng tiền: {formatPrice(totalPrice)} VND
                  </Typography>
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleBooking()}
                  >
                    {loading ? "Logging in..." : "Booking now"}
                  </Button>
                </>
              </Paper>
            </Grid>
          </Grid>
          {/* Comments Section */}
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6">Comments</Typography>
            <>
              <List>
                {comments.map((comment, index) => (
                  <Paper style={{ padding: "40px 20px" }} key={index}>
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <Stack direction="row" spacing={2}>
                          <h5 style={{ margin: 0, textAlign: "left" }}>
                            {comment.user_name}
                          </h5>
                          <p style={{ textAlign: "left", color: "gray" }}>
                            {formatDate(comment.createdAt)}
                          </p>
                        </Stack>
                        <p style={{ textAlign: "left" }}>
                          {comment.comment_text}
                        </p>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </List>

              <TextField
                label="Add a Comment"
                value={newComment}
                onChange={handleCommentChange}
                fullWidth
                multiline
                rows={3}
                sx={{ my: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
              >
                Submit Comment
              </Button>
            </>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default HotelDetail;
