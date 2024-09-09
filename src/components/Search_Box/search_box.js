import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import axios from "axios";

const SearchBox = () => {
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

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

    fetchLocations();
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
    <div className="search_box">
      {/* Location input */}
      <input
        type="text"
        placeholder="Location"
        value={selectedLocation}
        onClick={handleInputClick}
        readOnly
      />

      {/* Date inputs and search button */}
      <input type="date" placeholder="Check in" />
      <input type="date" placeholder="Check out" />
      <button>Search</button>

      {/* Modal */}
      {modalVisible && (
        <div className="location-modal">
          <div className="location-modal-content">
            <span className="location-close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>
              <FormattedMessage id="selectedLocation" defaultMessage="selectedLocation" />
            </h2>
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
};

export default SearchBox;
