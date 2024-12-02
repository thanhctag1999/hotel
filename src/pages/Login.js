import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/login.css";

const Login = () => {
  const API_URL = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // Track current step: 'email' or 'password'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setStep("password"); // Move to the password screen
    } else {
      toast.error("Please enter your email");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/v1/user/login`, {
        email,
        password,
      });

      if (response && response.status === 200) {
        const { data } = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("address", data.address);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("role", data.role);

        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Email or password is incorrect");
      }
    } catch (error) {
      toast.error("Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const result = await axios.post(`${API_URL}/api/v1/user/login/google`, {
        token: credentialResponse.credential,
      });

      if (result && result.status === 200) {
        const { data } = result.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("address", data.address);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("role", data.role);

        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address to reset password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/v1/user/forgot-password`,
        {
          email,
        }
      );

      if (response && response.status === 200) {
        toast.success("Password reset email sent");
      } else {
        toast.error("Failed to send password reset email");
      }
    } catch (error) {
      toast.error("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("email"); // Go back to the email step
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p>Log in to continue to your account</p>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Next</button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
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
            <div className="forgot-password">
              <a href="#" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </div>
            <button type="button" onClick={handleBack} className="back-button">
              Back
            </button>
          </form>
        )}

        <div style={{ marginTop: 15 }} className="google-login">
          {loading ? (
            <button disabled className="loading-button">
              Logging in with Google...
            </button>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => toast.error("Google login failed")}
            />
          )}
        </div>

        <div className="login-link">
          <p>New to Booking?</p>
          <a href="/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
