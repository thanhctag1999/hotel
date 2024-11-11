import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start loading before request

      const response = await axios.post(
        "https://api-tltn.onrender.com/api/v1/user/login",
        {
          email: email,
          password: password,
        }
      );

      if (response && response.status === 200) {
        const { data } = response.data;

        // Save the token and user information to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("address", data.address);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("role", data.role);

        // Navigate to the user profile page
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Email or password is incorrect");
      }
    } catch (error) {
      toast.error("Email or password is incorrect");
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p>Log in to continue to your account</p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="login-link">
          <p>New to Booking?</p>
          <a href="/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
