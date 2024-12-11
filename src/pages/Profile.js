import axios from "axios";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const API_URL = process.env.REACT_APP_API;
  const [phone, setPhone] = useState(
    localStorage.getItem("phoneNumber") !== "[object Object]"
      ? localStorage.getItem("phoneNumber")
      : ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("address") !== "[object Object]"
      ? localStorage.getItem("address")
      : ""
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomPayload = {
          userName: localStorage.getItem("userName"),
          fullName: localStorage.getItem("fullName"),
          phoneNumber: phone,
          address: address,
        };

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/v1/user/update-info`,
        roomPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
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
        <h1>
          {" "}
          <FormattedMessage id="profile" defaultMessage="profile" />
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="profile-form">
            <div className="flex">
              <div className="profile-input-form">
                <label htmlFor="">
                  {" "}
                  <FormattedMessage id="username" defaultMessage="username" />
                </label>
                <input
                  className="profile-input readOnly"
                  type="text"
                  readOnly
                  value={localStorage.getItem("userName")}
                />
              </div>
              <div className="profile-input-form">
                <label htmlFor="">
                  {" "}
                  <FormattedMessage id="fullname" defaultMessage="fullname" />
                </label>
                <input
                  className="profile-input readOnly"
                  type="text"
                  readOnly
                  value={localStorage.getItem("fullName")}
                />
              </div>
            </div>
            <div className="profile-input-form-lg">
              <label htmlFor="">
                <FormattedMessage id="phone" defaultMessage="phone" />
              </label>
              <input
                className="profile-input"
                type="phone"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="profile-input-form-lg">
              <label htmlFor="">
                <FormattedMessage id="address" defaultMessage="address" />
              </label>
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
            <FormattedMessage id="update" defaultMessage="update" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
