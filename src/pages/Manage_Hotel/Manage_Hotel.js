import React from "react";
import { FormattedMessage } from "react-intl";
import "./manage_hotel.css";
import CreateHotel from "./components/Create_hotel";

const ManageHotel = () => {

  return (
    <div className="page-container">
      <h2>
        <FormattedMessage
          id="namage_hotel_title"
          defaultMessage="namage_hotel_title"
        />
      </h2>
      <p>
        <FormattedMessage
          id="namage_hotel_desc"
          defaultMessage="namage_hotel_desc"
        />
      </p>
        <CreateHotel />
    </div>
  );
};

export default ManageHotel;
