// src/components/Header.js
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import bell from "../assests/icons/bell.png";
import language from "../assests/icons/language.png";
import logo from "../assests/logos/logo.png";

const Header = ({ changeLanguage }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const hanldeLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <header>
      <div className="header-logos">
        <Link to="/">
          <img className="header-logo" src={logo} alt="Logo" />
        </Link>
        <ul className="header-icons">
          <li className="header-icon icon-text">
            <b>VND</b>
          </li>
          <li className="header-icon" onClick={() => changeLanguage("fr-CA")}>
            <img className="header-icon" src={language} alt="Logo" />
          </li>
          <li className="header-icon">
            <img className="header-icon" src={bell} alt="Logo" />
          </li>
        </ul>
      </div>
      <nav className="header-items">
        <ul className="header-links">
          <li>
            <Link className="header-link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="header-link" to="/hotels">
              Hotels
            </Link>
          </li>
          <li>
            <Link className="header-link" to="/about">
              About us
            </Link>
          </li>
          <li>
            <Link className="header-link" to="/contact">
              Contact
            </Link>
          </li>
        </ul>
        <React.Fragment>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            {localStorage.getItem("userId") ? (
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Link className="header-link" to="/login">
                Login / Register
              </Link>
            )}
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Link className="link" to="/profile">
              <MenuItem>
                <Avatar /> Profile
              </MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={hanldeLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      </nav>
    </header>
  );
};

export default Header;
