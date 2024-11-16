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

const BookingHistory = () => {
  const today = new Date();
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelledBookings, setCancelledBookings] = useState([]); // State to track cancelled bookings

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
    const fetchDataBooking = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api-tltn.onrender.com/api/v1/booking/getBookingByUserID/${localStorage.getItem(
            "userId"
          )}`
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
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/booking/cancelBooking/${bookingId}`
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
        Booking History
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
                  src={booking.image_hotel || "https://via.placeholder.com/150"}
                  alt={booking.hotel_name}
                  style={{ width: 100, height: 100, marginRight: 16 }} // Adjust size and spacing
                />
                <ListItemText
                  primary={`${booking.hotel_name} - ${booking.room_id}`}
                  secondary={
                    <>
                      {`Check-in: ${formatDate(booking.check_in_date)}`}
                      <br />
                      {`Check-out: ${formatDate(booking.check_out_date)}`}
                      <br />
                      {`Guests: ${booking.people}`}
                      <br />
                      {`Total Price: ${formatPrice(booking.total_price)} VND`}
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
                      Cancel
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
                  {booking.booking_status === 0
                    ? "Haven't checked in yet"
                    : booking.booking_status === 1
                    ? "Checked in"
                    : booking.booking_status === 2
                    ? "Checked out"
                    : "Canceled"}
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
