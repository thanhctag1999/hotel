import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState(
    localStorage.getItem("phoneNumber") !== "undefined"
      ? localStorage.getItem("phoneNumber")
      : ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("address") !== "undefined"
      ? localStorage.getItem("address")
      : ""
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api-tltn.onrender.com/api/v1/user/update-info",
        {
          userName: localStorage.getItem("userName"),
          fullName: localStorage.getItem("fullName"),
          phoneNumber: phone,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response && response.status === 200) {
        const { data } = response.data;

        // Save the token and user information to localStorage
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.userName);

        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("address", data.address);
        localStorage.setItem("fullName", data.fullName);

        toast.success("Update successfull");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };
  return (
    <div className="page-container-flex">
      <ToastContainer />
      <div className="page-sidebar">
        <div className="page-sidebar-title">
          <Link to="/profile">
            <h4>Profile</h4>
          </Link>
          <Link to="/history">
            <h4>History</h4>
          </Link>
        </div>
      </div>
      <div className="page-contain">
        <h1>Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="profile-form">
            <div className="flex">
              <div className="profile-input-form">
                <label htmlFor="">UserName</label>
                <input
                  className="profile-input readOnly"
                  type="text"
                  readOnly
                  value={localStorage.getItem("userName")}
                />
              </div>
              <div className="profile-input-form">
                <label htmlFor="">FullName</label>
                <input
                  className="profile-input readOnly"
                  type="text"
                  readOnly
                  value={localStorage.getItem("fullName")}
                />
              </div>
            </div>
            <div className="profile-input-form-lg">
              <label htmlFor="">Phone</label>
              <input
                className="profile-input"
                type="phone"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="profile-input-form-lg">
              <label htmlFor="">Address</label>
              <textarea
                rows="10"
                type="text"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <button className="btn" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
