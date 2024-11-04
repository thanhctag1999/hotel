import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import axios from "axios";

const BookingHistory = () => {
  const today = new Date();
  const [bookingHistory, setBookingHistory] = useState([]);

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
    const fetchDataBooking = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/booking/getBookingByUserID/${localStorage.getItem(
            "userId"
          )}`
        );
        if (response && response.status === 200) {
          setBookingHistory(response.data.data);
        } else {
          console.error("There was an error fetching the hotels!");
        }
      } catch (error) {
        console.error("There was an error fetching the hotels!");
      }
    };

    fetchDataBooking();
  }, []);

  return (
    <Box sx={{ padding: 2, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h3" gutterBottom>
        Booking History
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
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
                secondary={`Check-in: ${formatDate(
                  booking.check_in_date
                )}, Check-out: ${formatDate(booking.check_out_date)}, Guests: ${
                  booking.people
                }, Total Price: ${formatPrice(booking.total_price)} VND`}
                sx={{ marginLeft: 2 }} // Add margin to ListItemText
              />
              {new Date(booking.checkInDate) > today && (
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginLeft: 2 }}
                >
                  Cancel
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default BookingHistory;
