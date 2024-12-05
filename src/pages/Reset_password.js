import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI components
import {
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

const ResetPassword = () => {
  const API_URL = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility

  // Extract token from the URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  console.log(token);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Basic validation to check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/v1/user/change-password-forgot/${token}`,
        {
          password, // Send the new password in the body
        }
      );

      if (response && response.status === 200) {
        toast.success("Password changed successfully!");
        navigate("/login"); // Redirect to login page after successful reset
      } else {
        toast.error("Password reset failed!");
      }
    } catch (error) {
      toast.error("An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="reset-password-page"
      style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}
    >
      <ToastContainer />
      <div className="reset-password-container">
        <h2>
          <FormattedMessage id="resetPass" defaultMessage="resetPass" />
        </h2>
        <form onSubmit={handlePasswordReset}>
          <TextField
            label={<FormattedMessage id="newPass" defaultMessage="newPass" />}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label={<FormattedMessage id="confirmPass" defaultMessage="confirmPass" />}
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            style={{ padding: "12px" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <FormattedMessage id="confirm" defaultMessage="confirm" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
