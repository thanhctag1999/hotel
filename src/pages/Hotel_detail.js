import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Stack,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import "../css/hotel_detail.css";
import { DateTime } from "luxon";
import { ToastContainer, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import "react-toastify/dist/ReactToastify.css";

const HotelDetail = () => {
  const API_URL = process.env.REACT_APP_API;
  const { hotel_id } = useParams();
  const [numPeople, setNumPeople] = useState(1);
  const today = new Date();
  const defaultDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const [checkInDate, setCheckInDate] = useState(defaultDate);
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const defaultCheckOutDate = nextDay.toISOString().split("T")[0];
  const [checkOutDate, setCheckOutDate] = useState(
    defaultCheckOutDate
  );
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [comments, setComments] = useState([]);
  const [hotel, setHotel] = useState({});
  const [service, setService] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const getNextDay = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day
    return nextDay.toISOString().split("T")[0]; // Return the date in 'YYYY-MM-DD' format
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/hotel/findById/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setHotel(response.data.data); // Store the hotel object directly
        } else {
          setHotel({});
        }
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the hotel details!", error);
        setLoading(false);
      }
    };

    const fetchService = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/service/findByHotelId/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setService(response.data.data); // Store service array
        } else {
          setService([]);
        }
      } catch (error) {
        console.error("There was an error fetching the services!", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/comment/getCommentByHotelId/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setComments(response.data.data);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("There was an error fetching the comments!", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/room/getRoomsByHotelId/${hotel_id}`
        );
        if (response.status === 200 && response.data && response.data.data) {
          setRooms(response.data.data);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("There was an error fetching the comments!", error);
      }
    };

    fetchDetail();
    fetchService();
    fetchRooms();
    fetchComments();
  }, [hotel_id]);

  useEffect(() => {
    calculatePrice();
  }, [checkInDate, checkOutDate, selectedRoom]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    const API_URL = process.env.REACT_APP_API;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");
    const apiUrl = `${API_URL}/api/v1/comment/create`;

    if (newComment.trim() !== "") {
      try {
        const response = await axios.post(
          apiUrl,
          {
            user_id: userId,
            hotel_id: hotel_id,
            comment_text: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Comment added successfully!");
          setComments([
            ...comments,
            {
              user_id: userId,
              user_name: fullName,
              comment_text: newComment,
              createdAt: DateTime.now().toISO(), // ISO format for the timestamp
            },
          ]);
          setNewComment("");
        }
        else{
          toast.error("Failed to add comment. Please booking hotel first");
        }
      } catch (error) {
        toast.error("Failed to add comment. Please booking hotel first");
      }
    } else {
      toast.error("Comment cannot be empty.");
    }
  };

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setNumPeople(event.target.value);
  };

  const handleCheckInDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate >= today) {
      setCheckInDate(selectedDate);
    } else {
      toast.error("Ngày check in không thể nhỏ hơn ngày hiện tại");
    }
  };

  const handleCheckOutDateChange = (event) => {
    setCheckOutDate(event.target.value);
  };

  const calculatePrice = () => {
    const roomPrice = rooms.find((room) => room.id === selectedRoom)?.new_price > 0 ? rooms.find((room) => room.id === selectedRoom)?.new_price : 0;

    if (!roomPrice) return setTotalPrice(0); // Ensure totalPrice is reset if no room is selected

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Check if the dates are valid
    if (isNaN(start) || isNaN(end)) {
      setTotalPrice(0);
      return;
    }

    // Show an error if the check-in date is later than the check-out date
    if (start >= end) {
      toast.error("Check-out date must be after the check-in date");
      setTotalPrice(0);
      return;
    }

    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setTotalPrice(days * roomPrice);
  };


  const handleBooking = async () => {
    if (localStorage.getItem("userId") !== null) {
      try {
        setLoading(true);
        if (checkInDate < today) {
          toast.error("Ngày check in không thể nhỏ hơn ngày hiện tại");
        }
        const body = {
          user_id: localStorage.getItem("userId"),
          room_id: selectedRoom,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_price: totalPrice,
          people: numPeople,
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/api/v1/booking/createboking`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set Authorization header
            },
          }
        );

        if (response && response.status === 201) {
          toast.success("Booking successful");
        } else {
          toast.error("Booking failed. Please try again.");
        }
      } catch (error) {
        if (
          (error.response && error.response.status === 401) ||
          error.response.status === 403
      ) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error("Booking failed. Please try again later.");
        }
      }
    } else {
      toast.error("Please login before booking");
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // Center horizontally
            margin: "0 auto",
            padding: 2,
            marginTop: "20%",
            width: "fit-content", // Ensures box size fits content
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: 2,
          }}
        >
          <ToastContainer />
          <Grid container spacing={2}>
            {/* Left side - Hotel Information */}
            <Grid item xs={8}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <>
                  <Typography variant="h3" gutterBottom>
                    {hotel.hotelName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>
                      <FormattedMessage id="address" defaultMessage="address" />
                      :
                    </strong>{" "}
                    {hotel.address}
                  </Typography>

                  {/* Hotel Image */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      my: 2,
                    }}
                  >
                    <img
                      className="list-hotel-img"
                      src={`${API_URL}/${hotel.image_path}`}
                      alt={hotel.hotel_name}
                      style={{
                        width: "100%",
                        minHeight: "450px",
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://grandtouranehotel.com/uploads/product/sp_55.jpg";
                      }}
                    />
                  </Box>

                  <Typography variant="body1" paragraph>
                    {hotel.description}
                  </Typography>

                  {/* Services */}
                  <Typography variant="h6">
                    <FormattedMessage id="services" defaultMessage="services" />
                  </Typography>
                  <List>
                    {service.map((serviceItem, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={serviceItem.service_name} />
                      </ListItem>
                    ))}
                  </List>
                </>
              </Paper>
            </Grid>

            {/* Right side - Room Selection */}
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <>
                  <h5>
                    <FormattedMessage id="booking" defaultMessage="booking" />
                  </h5>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>
                      <FormattedMessage
                        id="room_number"
                        defaultMessage="room_number"
                      />
                    </InputLabel>
                    <Select
                      value={selectedRoom}
                      onChange={(e) => handleRoomChange(e)}
                      label="Room Number"
                      sx={{
                        borderRadius: "15px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "15px",
                        },
                      }}
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          Phòng {room.room_number} - Giá:
                          {formatPrice(room.original_price) !==
                          formatPrice(room.new_price) ? (
                            <>
                              <span
                                style={{
                                  marginLeft: "10px",
                                  textDecoration: "line-through",
                                }}
                              >
                                {" "}
                                {formatPrice(room.original_price)} VND
                              </span>{" "}
                              <span
                                style={{ marginLeft: "10px", color: "red" }}
                              >
                                {" "}
                                {room.new_price > 0
                                  ? formatPrice(room.new_price)
                                  : "0"}{" "}
                                VND
                              </span>
                            </>
                          ) : (
                            <span>{formatPrice(room.original_price)} VND</span>
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>
                      <FormattedMessage
                        id="quantity_people"
                        defaultMessage="quantity_people"
                      />
                    </InputLabel>
                    <Select
                      value={numPeople}
                      onChange={(e) => handleQuantityChange(e)}
                      label="Quantity of People"
                      sx={{
                        borderRadius: "15px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "15px",
                        },
                      }}
                    >
                      {[1, 2, 3, 4].map((quantity) => (
                        <MenuItem key={quantity} value={quantity}>
                          {quantity}{" "}
                          {quantity > 1 ? (
                            <FormattedMessage
                              id="people"
                              defaultMessage="people"
                            />
                          ) : (
                            <FormattedMessage
                              id="person"
                              defaultMessage="person"
                            />
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label={
                      <FormattedMessage
                        id="check_in"
                        defaultMessage="check_in"
                      />
                    }
                    type="date"
                    value={checkInDate}
                    onChange={(e) => handleCheckInDateChange(e)}
                    fullWidth
                    InputBaseComponentProps={{
                      min: today, // Set the minimum selectable date
                    }}
                    InputProps={{
                      inputProps: {
                        min: today, // Set the minimum selectable date
                      },
                    }}
                    sx={{
                      my: 2,
                      borderRadius: "15px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "15px", // For the TextField input area
                      },
                    }}
                  />
                  <TextField
                    label={
                      <FormattedMessage
                        id="check_out"
                        defaultMessage="check_out"
                      />
                    }
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => handleCheckOutDateChange(e)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      my: 2,
                      borderRadius: "15px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "15px", // For the TextField input area
                      },
                    }}
                    inputProps={{
                      min: getNextDay(checkInDate), // Disable check-out dates before the check-in date
                    }}
                  />
                  <br />
                  <Typography fullWidth sx={{ mt: 2 }} variant="h6">
                    <FormattedMessage
                      id="total_price"
                      defaultMessage="total_price"
                    />
                    : {formatPrice(totalPrice)} VND
                  </Typography>
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      backgroundColor: "#ec6a00",
                      "&:hover": {
                        backgroundColor: "#d65c00", // Darker shade on hover
                      },
                      borderRadius: "15px",
                    }}
                    onClick={() => handleBooking()}
                  >
                    {loading ? (
                      "Loading in..."
                    ) : (
                      <FormattedMessage
                        id="booking_now"
                        defaultMessage="booking_now"
                      />
                    )}
                  </Button>
                </>
              </Paper>
            </Grid>
          </Grid>
          {/* Comments Section */}
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6">
              <FormattedMessage id="comments" defaultMessage="comments" />
            </Typography>
            <>
              <List>
                {comments.map((comment, index) => (
                  <Paper
                    style={{ padding: "10px 10px" }}
                    elevation={0}
                    key={index}
                  >
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <Stack direction="row" spacing={2}>
                          <h5 style={{ margin: 0, textAlign: "left" }}>
                            {comment.user_name}
                          </h5>
                          <p style={{ textAlign: "left", color: "gray" }}>
                            {formatDate(comment.createdAt)}
                          </p>
                        </Stack>
                        <p style={{ textAlign: "left" }}>
                          {comment.comment_text}
                        </p>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </List>

              <TextField
                label={
                  <FormattedMessage
                    id="comment_placeholder"
                    defaultMessage="comment_placeholder"
                  />
                }
                value={newComment}
                onChange={handleCommentChange}
                fullWidth
                multiline
                rows={3}
                sx={{
                  my: 2,
                  borderRadius: "15px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px", // For the TextField input area
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleCommentSubmit}
                sx={{
                  backgroundColor: "#ec6a00",
                  "&:hover": {
                    backgroundColor: "#d65c00", // Darker shade on hover
                  },
                  borderRadius: "15px",
                }}
              >
                <FormattedMessage
                  id="submit_comment"
                  defaultMessage="submit_comment"
                />
              </Button>
            </>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default HotelDetail;
