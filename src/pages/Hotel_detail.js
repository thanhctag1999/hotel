import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "../css/hotel_detail.css"; // Additional custom styling

const HotelDetail = () => {
  const [numPeople, setNumPeople] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [comments, setComments] = useState([
    { user: "John Doe", text: "Great place, highly recommended!" },
    { user: "Jane Smith", text: "Loved the amenities and service!" },
    { user: "Bob Johnson", text: "The views were breathtaking." },
  ]);
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hotel = {
    name: "Sunny Beach Resort",
    location: "Da Nang, Vietnam",
    services: ["Free Wifi", "Breakfast Included", "Airport Shuttle", "Pool"],
    images: [
      "https://i.pinimg.com/564x/e6/6c/e4/e66ce4bd83482aba81513c347f941905.jpg",
      "https://i.pinimg.com/736x/a5/cc/56/a5cc56cc7a2f787be03ffd75b9f33f1a.jpg",
      "https://i.pinimg.com/736x/23/02/34/2302343f9e7d9744f77072f9d34e8d04.jpg",
    ],
    description:
      "Experience a luxurious stay with breathtaking ocean views, world-class services, and modern amenities.",
    roomTypes: [
      { type: "Single Room", pricePerNight: 100 },
      { type: "Double Room", pricePerNight: 150 },
      { type: "Suite", pricePerNight: 250 },
    ],
  };

  const calculatePrice = () => {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    const selectedRoom = hotel.roomTypes.find(
      (room) => room.type === selectedRoomType
    );
    const pricePerNight = selectedRoom ? selectedRoom.pricePerNight : 0;

    const totalCost = differenceInDays * pricePerNight * numPeople;
    return isNaN(totalCost) ? 0 : totalCost.toFixed(2);
  };

  const handlePeopleChange = (e) => {
    setNumPeople(e.target.value);
  };

  const handleCheckInChange = (e) => {
    setCheckInDate(e.target.value);
  };

  const handleCheckOutChange = (e) => {
    setCheckOutDate(e.target.value);
  };

  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, { user: "You", text: newComment }]);
      setNewComment("");
    }
  };

  // Functions for carousel
  const nextImage = () => {
    setCurrentImageIndex(
      currentImageIndex === hotel.images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? hotel.images.length - 1 : currentImageIndex - 1
    );
  };

  return (
    <Box
      sx={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: 2 }}
    >
      {/* Left content: Hotel Details */}
      <Box sx={{ flex: 3, marginRight: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h3" gutterBottom>
            {hotel.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Location:</strong> {hotel.location}
          </Typography>

          {/* Image Carousel */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              my: 2,
            }}
          >
            <IconButton
              onClick={prevImage}
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <img
              src={hotel.images[currentImageIndex]}
              alt={`Slide ${currentImageIndex + 1}`}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <IconButton
              onClick={nextImage}
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" paragraph>
            {hotel.description}
          </Typography>

          <Box>
            <Typography variant="h6">Services</Typography>
            <List>
              {hotel.services.map((service, index) => (
                <ListItem key={index}>
                  <ListItemText primary={service} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Typography variant="h6">Booking Details</Typography>

            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="room-type-label">Room Type</InputLabel>
              <Select
                labelId="room-type-label"
                value={selectedRoomType}
                onChange={handleRoomTypeChange}
              >
                {hotel.roomTypes.map((room, index) => (
                  <MenuItem key={index} value={room.type}>
                    {room.type} - ${room.pricePerNight} per night
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Number of People"
              type="number"
              value={numPeople}
              onChange={handlePeopleChange}
              sx={{ my: 1 }}
              fullWidth
            />
            <TextField
              label="Check-in Date"
              type="date"
              value={checkInDate}
              onChange={handleCheckInChange}
              InputLabelProps={{ shrink: true }}
              sx={{ my: 1 }}
              fullWidth
            />
            <TextField
              label="Check-out Date"
              type="date"
              value={checkOutDate}
              onChange={handleCheckOutChange}
              InputLabelProps={{ shrink: true }}
              sx={{ my: 1 }}
              fullWidth
            />
            <Typography variant="h6" sx={{ my: 2 }}>
              Total Price: ${calculatePrice()}
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Book Now
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Right content: Sidebar for Comments */}
      <Box sx={{ flex: 1 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6">Comments</Typography>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText primary={comment.user} secondary={comment.text} />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Add a Comment"
            value={newComment}
            onChange={handleCommentChange}
            fullWidth
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleCommentSubmit} fullWidth>
            Submit Comment
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default HotelDetail;
