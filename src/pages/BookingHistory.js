import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom"; // Use this if you are using react-router

const BookingHistory = () => {
  const API_URL = process.env.REACT_APP_API;
  const today = new Date();
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelledBookings, setCancelledBookings] = useState([]); // State to track cancelled bookings
  const navigate = useNavigate(); // Initialize navigation

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "")
      .trim();
  };

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Redirecting to login.");
      navigate("/login"); // Redirect to login page
      return;
    }

    const fetchDataBooking = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/v1/booking/getBookingByUserID/${localStorage.getItem(
            "userId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request
            },
          }
        );
        if (response && response.status === 200) {
          const sortedBookingHistory = response.data.data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // For descending order (latest first)
          });
          setBookingHistory(sortedBookingHistory);
          setLoading(false);
        } else {
          console.error("There was an error fetching the hotels!");
          setLoading(false);
        }
      } catch (error) {
        console.error("There was an error fetching the hotels!");
        setLoading(false);
      }
    };

    fetchDataBooking();
  }, [API_URL, navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/booking/cancelBooking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request
          },
        }
      );
      if (response.status === 200) {
        toast.success("Booking cancelled successfully!"); // Show success toast
        setCancelledBookings((prevCancelledBookings) => [
          ...prevCancelledBookings,
          bookingId, // Add the booking ID to the cancelled list
        ]);
      } else {
        toast.error("Error cancelling booking. Please try again."); // Show error toast
      }
    } catch (error) {
      toast.error("Error cancelling booking. Please try again."); // Show error toast
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer />
      <Typography variant="h3" gutterBottom>
        <FormattedMessage
          id="booking_history"
          defaultMessage="booking_history"
        />
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
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
          <List>
            {bookingHistory.map((booking) => (
              <ListItem key={booking.id} sx={{ marginBottom: 2 }}>
                <img
                  className="list-hotel-img"
                  src={`${API_URL}/${booking.image_path}`}
                  alt={booking.hotel_name}
                  style={{ width: 100, height: 100, marginRight: 16 }}
                  onError={(e) => {
                    e.target.src =
                      "https://grandtouranehotel.com/uploads/product/sp_55.jpg";
                  }}
                />

                <ListItemText
                  primary={`${booking.hotel_name} - ${booking.room_id}`}
                  secondary={
                    <>
                      <FormattedMessage
                        id="check_in"
                        defaultMessage="check_in"
                      />
                      : {formatDate(booking.check_in_date)}
                      <br />
                      <FormattedMessage
                        id="check_out"
                        defaultMessage="check_out"
                      />{" "}
                      {formatDate(booking.check_out_date)}
                      <br />
                      <FormattedMessage
                        id="quantity_people"
                        defaultMessage="quantity_people"
                      />{" "}
                      {booking.people}
                      <br />
                      <FormattedMessage
                        id="total_price"
                        defaultMessage="total_price"
                      />{" "}
                      {formatPrice(booking.total_price)} VND
                    </>
                  }
                  sx={{ marginLeft: 2 }} // Add margin to ListItemText
                />
                {new Date(booking.check_in_date) > today &&
                  booking.booking_status === 0 &&
                  !cancelledBookings.includes(booking.id) && ( // Only show button if booking isn't cancelled
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        marginLeft: 2,
                        color: "white",
                        backgroundColor: "#ec6a00",
                        "&:hover": {
                          backgroundColor: "#d65c00",
                        },
                        borderRadius: "15px",
                        border: "none",
                      }}
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      <FormattedMessage id="cancel" defaultMessage="cancel" />
                    </Button>
                  )}

                {/* Display booking status */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    marginLeft: 2,
                    fontStyle: "italic",
                    marginTop: 1,
                  }}
                >
                  {booking.booking_status === 0 ? (
                    <FormattedMessage
                      id="not_check_in"
                      defaultMessage="not_check_in"
                    />
                  ) : booking.booking_status === 1 ? (
                    <FormattedMessage
                      id="checked_in"
                      defaultMessage="checked_in"
                    />
                  ) : booking.booking_status === 2 ? (
                    <FormattedMessage
                      id="checked_out"
                      defaultMessage="checked_out"
                    />
                  ) : (
                    <FormattedMessage id="canceled" defaultMessage="canceled" />
                  )}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default BookingHistory;
