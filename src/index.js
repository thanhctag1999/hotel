import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Create a root element to render the React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component to the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
