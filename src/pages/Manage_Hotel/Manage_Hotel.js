import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Tabs, Tab, Box } from "@mui/material";
import "./manage_hotel.css";
import CreateHotel from "./components/Create_hotel";
import ManageRooms from "./components/ManageRooms";

const ManageHotel = () => {
  const [activeTab, setActiveTab] = useState("hotel");
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <div className="page-container">
      <h2>
        <FormattedMessage
          id="manage_hotel_title"
          defaultMessage="Manage Hotel"
        />
      </h2>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="manage hotel tabs"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab className="tabs-item" label="Manage Hotel" value="hotel" />
        <Tab className="tabs-item" label="Manage Rooms" value="rooms" />
      </Tabs>

      <Box sx={{ padding: 2 }}>
        {activeTab === "hotel" ? <CreateHotel /> : <ManageRooms />}
      </Box>
    </div>
  );
};

export default ManageHotel;
