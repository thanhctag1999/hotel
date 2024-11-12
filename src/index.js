import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Create a root element to render the React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component to the root element
root.render(
  <GoogleOAuthProvider clientId="809619833872-05spcifgkh2nguqd7jajmtdtgjnima9p.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
