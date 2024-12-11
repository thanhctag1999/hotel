import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const CreateRoom = () => {
  const API_URL = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    room_type_id: "1",
    room_number: "",
    price: "",
    description: "",
    availability_status: "OK",
  });

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the hotel ID from localStorage
    const hotelId = localStorage.getItem("hotelId");

    if (!hotelId) {
      alert("Hotel ID not found in localStorage");
      return;
    }

    // Prepare the data for the API request
    const roomPayload = {
      hotel_id: hotelId,
      room_type_id: roomData.room_type_id,
      room_number: roomData.room_number,
      price: roomData.price,
      description: roomData.description,
      availability_status: roomData.availability_status,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/room/createRoom`,
        roomPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Room created successfully!");
        // Navigate back after a short delay to show the success message
        setTimeout(() => navigate(-1), 1500); // Navigate to the previous page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="create_room" defaultMessage="create_room" />
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="room_number"
                  defaultMessage="room_number"
                />
              }
              name="room_number"
              value={roomData.room_number}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={<FormattedMessage id="price" defaultMessage="price" />}
              name="price"
              type="number"
              value={roomData.price}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="description_room"
                  defaultMessage="description_room"
                />
              }
              name="description"
              multiline
              rows={4}
              value={roomData.description}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              <FormattedMessage id="create_room" defaultMessage="create_room" />
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateRoom;
