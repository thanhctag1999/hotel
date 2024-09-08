import React, { useEffect, useState } from "react";
import axios from "axios";
import Rating from "@mui/material/Rating";
import location from "../../assests/icons/location.png";

export default function List_Hotel() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios
      .get("https://api-tltn.onrender.com/api/v1/hotel/list-all") // Replace with your actual API endpoint
      .then((response) => {
        setHotels(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="page-hotel">
      <h2>Hot Booking</h2>
      {hotels.map((hotel) => (
        <div key={hotel.id} className="list-hotel-item">
          <div className="flex">
            <img
              className="list-hotel-img"
              src={hotel.image_hotel || "https://via.placeholder.com/150"} // Fallback image
              alt={hotel.hotel_name}
            />
            <div className="list-hotel-contain">
              <h4>{hotel.hotel_name}</h4>
              <div className="location">
                <img className="icon" src={location} alt="Location Icon" />
                <p>{hotel.location}</p>
              </div>
              <Rating
                name={`rating-${hotel.id}`}
                value={parseFloat(hotel.rating)}
                readOnly
              />
              <p className="list-hotel-desc">{hotel.description}</p>
              <b>$400</b> {/* Assuming price is static */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
