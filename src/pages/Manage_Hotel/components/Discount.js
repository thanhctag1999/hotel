import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
} from "@mui/material";

const Discount = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await axios.get(
        "https://api-tltn.onrender.com/api/v1/promotion/promotions",
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
    fetchPromotions();
  }, []);

  const handleUsePromotion = (id) => {
    alert(`Promotion with ID ${id} is being used!`);
    // Add your logic here to "use" the promotion
  };

  return (
    <div style={{ padding: "20px" }}>
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
                <strong>Type:</strong>{" "}
                {promotion.discount_type === "percentage"
                  ? "Percentage"
                  : "Fixed Amount"}
              </p>
              <p>
                <strong>Value:</strong>{" "}
                {promotion.discount_type === "percentage"
                  ? `${promotion.discount_value}%`
                  : `${promotion.discount_value}đ`}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(promotion.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(promotion.end_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
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
                Use Promotion
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Discount;
