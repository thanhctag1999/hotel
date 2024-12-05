import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import axios from "axios";
import { FormattedMessage } from "react-intl";

const Booking = () => {
  const API_URL = process.env.REACT_APP_API;
  const [hotel, setHotel] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(null); // State to store the hotel's income

  // Fetch hotel, bookings, and income data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);

        // Fetch user-related data
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        // Fetch hotel details
        const hotelResponse = await axios.get(
          `${API_URL}/api/v1/hotel/getHotelByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (hotelResponse.status === 200) {
          const hotelData = hotelResponse.data.data;
          setHotel(hotelData);

          // Fetch bookings for the fetched hotel
          const bookingsResponse = await axios.get(
            `${API_URL}/api/v1/booking/getBookingByHotelId/${hotelData.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (bookingsResponse.status === 200) {
            setBookings(
              Array.isArray(bookingsResponse.data.data)
                ? bookingsResponse.data.data
                : []
            );
          } else {
            setBookings([]);
          }

          // Fetch income for the hotel
          const incomeResponse = await axios.get(
            `${API_URL}/api/v1/hotel/getIncomeById/${hotelData.id}`,
          );

          if (incomeResponse.status === 200) {
            setIncome(parseFloat(incomeResponse.data.data)); // Parse income to a number
          } else {
            setIncome(0);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setBookings([]);
        setIncome(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, []);

  // Filter bookings for the selected date
  const filteredBookings =
    Array.isArray(bookings) && selectedDate
      ? bookings.filter((booking) =>
          dayjs(booking.check_in_date).isSame(selectedDate, "day")
        )
      : [];

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/booking/cancelBooking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking cancelled successfully!");
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, booking_status: 3 }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={4}
      padding={2}
    >
      <ToastContainer />
      {/* Left Section: Display booking details */}
      <Box flex={1}>
        <Typography variant="h5" marginBottom={2}>
          <FormattedMessage id="booking_on" defaultMessage="booking_on" />{" "}
          {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
        </Typography>
        <Typography variant="h6" marginBottom={2} color="primary">
          <FormattedMessage id="income" defaultMessage="income" />:{" "}
          {income ? `${income.toLocaleString()} VND` : "0.0 VND"}
        </Typography>
        <Grid container spacing={2}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <strong>
                        <FormattedMessage
                          id="room_number"
                          defaultMessage="room_number"
                        />
                        :
                      </strong>{" "}
                      {booking.room_number || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage id="price" defaultMessage="price" />:
                      </strong>{" "}
                      {parseFloat(booking.total_price).toLocaleString()} VND
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="check_in"
                          defaultMessage="check_in"
                        />
                        :
                      </strong>{" "}
                      {dayjs(booking.check_in_date).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        {" "}
                        <FormattedMessage
                          id="check_out"
                          defaultMessage="check_out"
                        />
                        :
                      </strong>{" "}
                      {dayjs(booking.check_out_date).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        {" "}
                        <FormattedMessage
                          id="customer"
                          defaultMessage="customer"
                        />
                        :
                      </strong>{" "}
                      {booking.fullname || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        {" "}
                        <FormattedMessage id="phone" defaultMessage="phone" />:
                      </strong>{" "}
                      {booking.phone || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        {" "}
                        <FormattedMessage
                          id="quantity_people"
                          defaultMessage="quantity_people"
                        />
                        :
                      </strong>{" "}
                      {booking.people}
                    </Typography>
                    {booking.booking_status === 3 ? (
                      <Typography variant="body1">
                        <strong>
                          {" "}
                          <FormattedMessage
                            id="status"
                            defaultMessage="status"
                          />
                          :
                        </strong>{" "}
                        <FormattedMessage
                          id="canceled"
                          defaultMessage="canceled"
                        />
                      </Typography>
                    ) : null}
                  </CardContent>
                  {booking.booking_status !== 3 ? (
                    <CardActions>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <FormattedMessage id="cancel" defaultMessage="cancel" />
                      </Button>
                    </CardActions>
                  ) : null}
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                {selectedDate ? (
                  <FormattedMessage
                    id="no_booking"
                    defaultMessage="no_booking"
                  />
                ) : (
                  <FormattedMessage
                    id="select_booking_date"
                    defaultMessage="select_booking_date"
                  />
                )}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Right Section: Calendar */}
      <Box
        flex={{ xs: "none", md: 1 }}
        alignSelf="flex-start"
        sx={{ width: "100%", height: "100%" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default Booking;
