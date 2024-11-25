import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormattedMessage } from "react-intl";

const ManageRooms = () => {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://api-tltn.onrender.com/api/v1/hotel/getHotelByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setHotel(response.data.data);
          fetchRooms(response.data.data.id);
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async (hotelId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/room/getRoomsByHotelId/${hotelId}`
        );
        if (response.status === 200) {
          setRooms(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchHotel();
  }, []);

  const handleCreateRoomClick = () => {
    localStorage.setItem("hotelId", hotel.id);
    navigate("/create-room");
  };

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateRoom = async () => {
    try {
      const requestBody = {
        id: selectedRoom.id,
        hotel_id: selectedRoom.hotel_id,
        room_type_id: 1,
        room_number: selectedRoom.room_number,
        price: selectedRoom.price,
        description: selectedRoom.description,
        availability_status: selectedRoom.availability_status,
      };

      const response = await axios.post(
        `https://api-tltn.onrender.com/api/v1/room/updateRoom`,
        requestBody
      );

      if (response.status === 200) {
        toast.success("Update room successful");
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === selectedRoom.id ? selectedRoom : room
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Error updating room. Please try again.");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const response = await axios.get(
        `https://api-tltn.onrender.com/api/v1/room/deleteRoom/${id}`
      );
      if (response.status === 200) {
        toast.success("Delete room successful");
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
      }
    } catch (error) {
      toast.error("Delete room Fail");
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
    <div>
      <ToastContainer />
      <h2>
        <FormattedMessage id="manage_rooms" defaultMessage="manage_rooms" />
      </h2>
      <Button variant="contained" onClick={handleCreateRoomClick}>
        <FormattedMessage id="create_room" defaultMessage="create_room" />
      </Button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {rooms.map((room) => (
          <Card
            key={room.id}
            style={{ width: "300px", position: "relative", cursor: "pointer" }}
            onClick={() => handleOpenModal(room)}
          >
            <CardContent>
              <Typography variant="h5">
                <strong>Room {room.room_number}</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Price:</strong>{" "}
                {formatPrice(room.original_price) !==
                formatPrice(room.new_price) ? (
                  <>
                    <span style={{ textDecoration: "line-through" }}>
                      {formatPrice(room.original_price)} VND
                    </span>{" "}
                    -{" "}
                    <span style={{ color: "red" }}>
                      {formatPrice(room.new_price)} VND
                    </span>
                  </>
                ) : (
                  <span>{formatPrice(room.original_price)} VND</span>
                )}
              </Typography>

              <Typography variant="body2">
                <strong>Description:</strong> {room.description}
              </Typography>
              <Typography variant="body2">
                <strong>Availability:</strong>{" "}
                {room.availability_status === "OK"
                  ? "Available"
                  : "Not Available"}
              </Typography>
              <IconButton
                className="icon-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRoom(room.id);
                }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </div>
      {rooms.length === 0 && (
        <p>
          <FormattedMessage id="no_room" defaultMessage="no_room" />
        </p>
      )}

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          {selectedRoom && (
            <div>
              <TextField
                fullWidth
                label="Room Number"
                name="room_number"
                value={selectedRoom.room_number}
                onChange={handleInputChange}
                variant="outlined"
                style={{ marginBottom: "16px" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px", // Adjust the radius as needed
                  },
                }}
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formatPrice(selectedRoom.original_price)}
                onChange={handleInputChange}
                variant="outlined"
                style={{ marginBottom: "16px" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px", // Adjust the radius as needed
                  },
                }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={selectedRoom.description}
                onChange={handleInputChange}
                variant="outlined"
                style={{ marginBottom: "16px" }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px", // Adjust the radius as needed
                  },
                }}
              />
              <FormControl fullWidth style={{ marginBottom: "16px" }}>
                <InputLabel>Availability Status</InputLabel>
                <Select
                  label="Availability Status"
                  name="availability_status"
                  value={selectedRoom.availability_status}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px", // Adjust the radius as needed
                    },
                  }}
                >
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="Off">OFF</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="second" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRoom}
            color="primary"
            variant="contained"
          >
            Update Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageRooms;
