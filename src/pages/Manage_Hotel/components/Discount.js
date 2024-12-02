import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";


const Discount = () => {
  const API_URL = process.env.REACT_APP_API;
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hotel, setHotel] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [selectedPromotion, setSelectedPromotion] = useState(null);

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

  const fetchHotel = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${API_URL}/api/v1/hotel/getHotelByUserId/${userId}`,
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
      setIsLoading(false);
    }
  };

  const fetchRooms = async (hotelId) => {
    try {
      const response = await axios.get(
        `https://api-tltn.onrender.com/api/v1/room/getRoomsByHotelId/${hotelId}`
      );
      if (response.status === 200) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await axios.get(
        `${API_URL}/api/v1/promotion/promotions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        }
      );

      if (response.data.status === 200) {
        setPromotions(response.data.data);
      } else {
        alert("Failed to fetch promotions");
      }
    } catch (error) {
      console.error("Error fetching promotions: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
    fetchPromotions();
  }, []);

  const handleUsePromotion = (id) => {
    setSelectedPromotion(id);
    setOpenModal(true);
  };

  const handleCheckboxChange = (roomId) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const handleConfirm = async () => {
    const selectedRoomIds = Object.keys(selectedRooms).filter(
      (roomId) => selectedRooms[roomId]
    );

    try {
      // Loop through selected rooms and make API calls for each
      for (const roomId of selectedRoomIds) {
        const response = await axios.post(
          `${API_URL}/api/v1/promotion/promotions/room`,
          {
            promotion_id: selectedPromotion,
            hotel_id: hotel.id, // Assuming `hotel.id` is available from `fetchHotel`
            room_id: roomId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional token if required
            },
          }
        );

        if (response.status === 201) {
          console.log(`Successfully applied promotion to room ${roomId}`);
        } else {
          toast.error(`Failed to apply promotion to room ${roomId}`);
        }
      }

      toast.success("Promotion successfully applied to selected rooms!");
    } catch (error) {
      console.error("Error applying promotion to rooms:", error);
      toast.error("Failed to apply promotion. Please try again.");
    } finally {
      setOpenModal(false);
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer />
      {isLoading ? (
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
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {promotions.map((promotion) => (
            <li
              key={promotion.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>{promotion.name}</h2>
              <p>{promotion.description}</p>
              <p>
                <strong>
                  <FormattedMessage
                    id="discount_type"
                    defaultMessage="discount_type"
                  />
                  :
                </strong>{" "}
                {promotion.discount_type === "percentage"
                  ? "Percentage"
                  : "Fixed Amount"}
              </p>
              <p>
                <strong>
                  <FormattedMessage
                    id="discount_value"
                    defaultMessage="discount_value"
                  />
                  :
                </strong>{" "}
                {promotion.discount_type === "percentage"
                  ? `${promotion.discount_value}%`
                  : `${promotion.discount_value}đ`}
              </p>
              <p>
                <strong>
                  <FormattedMessage
                    id="discount_start"
                    defaultMessage="discount_start"
                  />
                  :
                </strong>{" "}
                {new Date(promotion.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>
                  <FormattedMessage
                    id="discount_end"
                    defaultMessage="discount_end"
                  />
                  :
                </strong>{" "}
                {new Date(promotion.end_date).toLocaleDateString()}
              </p>
              <p>
                <strong>
                  <FormattedMessage
                    id="discount_status"
                    defaultMessage="discount_status"
                  />
                  :
                </strong>{" "}
                {promotion.status ? "Active" : "Inactive"}
              </p>
              <button
                onClick={() => handleUsePromotion(promotion.id)}
                style={{
                  backgroundColor: "#007BFF",
                  color: "#FFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <FormattedMessage
                  id="discount_use"
                  defaultMessage="discount_use"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          <FormattedMessage
            id="select_room_discount"
            defaultMessage="select_room_discount"
          />
        </DialogTitle>
        <DialogContent>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {rooms.map((room) => (
              <li key={room.id} style={{ marginBottom: "8px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!selectedRooms[room.id]}
                      onChange={() => handleCheckboxChange(room.id)}
                    />
                  }
                  label={`${room.room_number} - ${formatPrice(room.price)} VND`}
                />
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenModal(false)}
            color="second"
            variant="contained"
          >
            <FormattedMessage id="cancel" defaultMessage="cancel" />
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            <FormattedMessage id="confirm" defaultMessage="confirm" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Discount;
