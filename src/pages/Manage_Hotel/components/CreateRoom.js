import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";

const CreateRoom = () => {
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
      const response = await axios.post(
        "http://localhost:3000/api/v1/room/createRoom",
        roomPayload
      );
      if (response.status === 201) {
        toast.success("Room created successfully!");
      } else {
          toast.error("Failed to create room. Please try again");
      }
    } catch (error) {
        toast.error("Failed to create room. Please try again");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Create Room
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room Number"
              name="room_number"
              value={roomData.room_number}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
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
              label="Description"
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
              Create Room
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateRoom;
