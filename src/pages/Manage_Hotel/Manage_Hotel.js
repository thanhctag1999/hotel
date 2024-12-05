import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Tabs, Tab, Box } from "@mui/material";
import "./manage_hotel.css";
import CreateHotel from "./components/Create_hotel";
import ManageRooms from "./components/ManageRooms";
import Discount from "./components/Discount";
import Booking from "./components/Booking";

const ManageHotel = () => {
  const [activeTab, setActiveTab] = useState("hotel");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="page-container">
      <h2>
        <FormattedMessage
          id="manage_hotel_title"
          defaultMessage="manage_hotel_title"
        />
      </h2>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="manage hotel tabs"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="manage_hotel_title"
              defaultMessage="manage_hotel_title"
            />
          }
          value="hotel"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage id="manage_rooms" defaultMessage="manage_rooms" />
          }
          value="rooms"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="manage_discounts"
              defaultMessage="manage_discounts"
            />
          }
          value="discount"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="manage_bookings"
              defaultMessage="manage_bookings"
            />
          }
          value="booking"
        />
      </Tabs>

      <Box sx={{ padding: 2 }}>
        {activeTab === "hotel" ? (
          <CreateHotel />
        ) : activeTab === "rooms" ? (
          <ManageRooms />
        ) : activeTab === "booking" ? (
          <Booking />
        ) : (
          <Discount />
        )}
      </Box>
    </div>
  );
};

export default ManageHotel;
