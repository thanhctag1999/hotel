import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import axios from "axios";

const CreateHotel = () => {
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState([]);
  const [hotelName, setHotelName] = useState([]);
  const [star, setStar] = useState(2);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetch location data from the API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://api-tltn.onrender.com/api/v1/location/list-all"
        );
        if (response.status === 200) {
          setLocations(response.data.data); // Set the data in state
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
          setServices(response.data.data); // Set the data in state
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
    fetchServices();
  }, []);

  // Handle input click
  const handleInputClick = () => {
    setModalVisible(true);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setModalVisible(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="create_hotel_form">
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
          value={selectedLocation}
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
          <FormattedMessage id="how_many_star" defaultMessage="how_many_star" />
        </h5>
        <Box sx={{ "& > legend": { mt: 4 } }}>
          <Rating
            name="simple-controlled"
            value={star}
            onChange={(event, newValue) => {
              setStar(newValue);
            }}
          />
        </Box>
      </div>
      <div className="column">
        <h3>
          <FormattedMessage id="which_sevices" defaultMessage="which_sevices" />
        </h3>
        {services.map((service) => (
          <div className="div">
            <input
              className="checkbox"
              type="checkbox"
              name="service"
              key={service.id}
              value={service.service_name}
            ></input>
            <label htmlFor="service">{service.service_name}</label>
          </div>
        ))}
        <hr />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
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
                  onClick={() => handleLocationSelect(location.name_with_type)}
                >
                  {location.name_with_type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateHotel;
