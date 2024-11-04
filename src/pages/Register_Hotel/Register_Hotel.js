import { FormattedMessage } from "react-intl";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register_hotel.css";


const RegisterHotel = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/manage_hotel");

    // // Regular expression to validate password
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // // Check if the password and confirm password match
    // if (password !== confirmPassword) {
    //   toast.error("Password and confirm password do not match");
    // }
    // // Check if the password meets the required criteria
    // else if (!passwordRegex.test(password)) {
    //   toast.error(
    //     "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special symbol."
    //   );
    // } else {
    //   try {
    //     setLoading(true); // Set loading to true before making the request
    //     const response = await axios.post(
    //       "https://api-tltn.onrender.com/api/v1/user/register",
    //       {
    //         userName: userName,
    //         fullName: fullName,
    //         email: email,
    //         password: password,
    //       }
    //     );

    //     if (response && response.status === 201) {
    //       const { data } = response.data;
    //       // localStorage.setItem("token", data.token);
    //       // localStorage.setItem("userId", data.id);
    //       // localStorage.setItem("userName", data.userName);
    //       // localStorage.setItem("phoneNumber", data.phoneNumber);
    //       // localStorage.setItem("address", data.address);
    //       // localStorage.setItem("fullName", data.fullName);

    //       // // Navigate to the user profile page
    //       toast.success(<FormattedMessage id="auth" defaultMessage="auth" />);
    //     } else {
    //       toast.error(response.data.message);
    //     }
    //   } catch (error) {
    //     toast.error(error.response.data.message);
    //   } finally {
    //     setLoading(false); // Set loading to false after the request is done
    //   }
    // }
  };
  return (
    <div className="register_hotel flex-container">
      <div className="register_hotel_title">
        <h1>
          <FormattedMessage
            id="register_hotel_title"
            defaultMessage="register_hotel_title"
          />
        </h1>
        <h4>
          <FormattedMessage
            id="register_hotel_desc"
            defaultMessage="register_hotel_desc"
          />
        </h4>
      </div>
      <div className="register_hotel_form">
        <div className="register_hotel_container">
          <h2>
            <FormattedMessage
              id="register_hotel_title"
              defaultMessage="register_hotel_title"
            />
          </h2>
          <p>
            <FormattedMessage
              id="register_hotel_desc"
              defaultMessage="register_hotel_desc"
            />
          </p>
          <form className="login-input" onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="text"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterHotel;
