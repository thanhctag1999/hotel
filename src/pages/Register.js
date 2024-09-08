// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const notify = () => toast("Login failed");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api-tltn.onrender.com/api/v1/user/register",
        {
          userName: userName,
          fullName: fullName,
          email: email,
          password: password,
        }
      );

      if (response && response.status === 201) {
        const { data } = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.userName);

        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("address", data.address);
        localStorage.setItem("fullName", data.fullName);

        // Navigate to the user profile page
        toast.success("Register successfull");
        navigate("/");
      } else {
        toast.error("Register failed");
      }
    } catch (error) {
      toast.error("Register failed");
    }
  };
  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <h2>Join the Adventure!</h2>
        <p>Create your account and start your journey with us</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="login-link">
          <a href="/login">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
