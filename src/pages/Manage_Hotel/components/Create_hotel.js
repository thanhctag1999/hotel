import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const CreateHotel = () => {
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [hotel, setHotel] = useState([]);
  const [address, setAddress] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [star, setStar] = useState(2);
  const [description, setDescription] = useState(""); // New description state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [image, setImage] = useState("");
  const [imageObj, setImageObj] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://api-tltn.onrender.com/api/v1/location/list-all"
        );
        if (response.status === 200) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://api-tltn.onrender.com/api/v1/service/list-all"
        );
        if (response.status === 200) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3000/api/v1/hotel/getHotelByUserId/${userId}`
        );
        if (response.status === 200) {
          setHotel(response.data.data);
          handleLocationSelect(response.data.data.location);
          setAddress(response.data.data.address);
          setStar(parseInt(response.data.data.rating));
          setHotelName(response.data.data.hotelName);
          setSelectedServices(response.data.data.services);
          setImage(
            `http://localhost:3000/public/images/hotel/${response.data.data.imageHotel}`
          );
          setDescription(response.data.data.description || ""); // Set description from API if available
        }
      } catch (error) {
        console.error("Error fetching hotel:");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
    fetchLocations();
    fetchServices();
  }, []);

  const handleInputClick = () => {
    setModalVisible(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleServiceChange = (id) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(id)
        ? prevSelectedServices.filter((serviceId) => serviceId !== id)
        : [...prevSelectedServices, id]
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageObj(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = async () => {
    const hotelId = hotel.id;
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("hotel_name", hotelName);
    formData.append("location", selectedLocation);
    formData.append("address", address);
    formData.append("rating", star);
    formData.append("description", description); // Include description in form data
    formData.append("folderName", "hotel");
    selectedServices.forEach((serviceId) => {
      formData.append("services[]", serviceId);
    });

    if (imageObj) {
      formData.append("images", imageObj);
    }

    try {
      const url = hotelId
        ? `http://localhost:3000/api/v1/hotel/update/${hotelId}`
        : `http://localhost:3000/api/v1/hotel/register`;

      const method = hotelId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response && response.status === (hotelId ? 200 : 201)) {
        toast.success(hotelId ? "Update successful" : "Create successful");
      } else {
        toast.error(
          hotelId
            ? "Update failed. Please try again."
            : "Create failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating hotel:", error);
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
    <div className="create_hotel_form">
      <ToastContainer />
      <h3>
        <FormattedMessage id="hotel_location" defaultMessage="hotel_location" />
      </h3>
      <div className="column">
        <h5>
          <FormattedMessage id="location" defaultMessage="location" />
        </h5>
        <input
          type="text"
          placeholder="Location"
          value={
            locations.find((location) => location.id === selectedLocation)
              ?.name || ""
          }
          onClick={handleInputClick}
          readOnly
        />
        <h5>
          <FormattedMessage id="address" defaultMessage="address" />
        </h5>
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <h3>
        <FormattedMessage id="about_hotel" defaultMessage="about_hotel" />
      </h3>
      <div className="column">
        <h5>
          <FormattedMessage
            id="what_hotel_name"
            defaultMessage="what_hotel_name"
          />
        </h5>
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
        />
        <h5>
          <FormattedMessage id="hotel_image" defaultMessage="hotel_image" />
        </h5>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && (
          <img
            style={{ width: "100%", objectFit: "cover", marginTop: "10px" }}
            src={image}
            alt="Selected"
          />
        )}
        <h5>
          <FormattedMessage id="how_many_star" defaultMessage="how_many_star" />
        </h5>
        <Box sx={{ "& > legend": { mt: 4 } }}>
          <Rating
            name="simple-controlled"
            value={star}
            onChange={(event, newValue) => setStar(newValue)}
          />
        </Box>
        <h5>
          <FormattedMessage
            id="hotel_description"
            defaultMessage="hotel_description"
          />
        </h5>
        <textarea
          placeholder="Enter hotel description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          style={{ width: "100%", resize: "vertical", marginTop: "10px" }}
        />
      </div>
      <div className="column">
        <h3>
          <FormattedMessage
            id="which_services"
            defaultMessage="which_services"
          />
        </h3>
        {services.map((service) => (
          <div className="flex" key={service.id}>
            <label htmlFor={`service-${service.id}`}>
              {service.service_name}
            </label>
            <input
              className="checkbox"
              type="checkbox"
              name="service"
              value={service.service_name}
              checked={selectedServices.includes(service.id)}
              onChange={() => handleServiceChange(service.id)}
            />
          </div>
        ))}
        <hr />
        <button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Loading..." : "Submit"}
        </button>
        <hr />
      </div>

      {modalVisible && (
        <div className="location-modal">
          <div className="location-modal-content">
            <span className="location-close" onClick={handleCloseModal}>
              &times;
            </span>
            <h3>
              <FormattedMessage
                id="selectedLocation"
                defaultMessage="selectedLocation"
              />
            </h3>
            <ul>
              {locations.map((location) => (
                <li
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                >
                  {location.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateHotel;
