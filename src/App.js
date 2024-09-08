// src/App.js
import React, { useState } from "react";
import { I18nProvider, LOCALES } from "./i18n";
import { FormattedMessage } from "react-intl";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Hotel from "./pages/Hotel";
import Profile from "./pages/Profile";
import "./styles.css";

function App() {
  const [locale, setLocale] = useState(LOCALES.ENGLISH);
  const changeLanguage = (locale) => {
    setLocale(locale);
  }
  return (
    <I18nProvider locale={locale}>
      <Router>
        <Routes>
          {/* Routes without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with Layout */}
          <Route
            path="/hotels"
            element={
              <Layout changeLanguage={changeLanguage}>
                <Hotel />
              </Layout>
            }
          />
          <Route
            path="/"
            element={
              <Layout changeLanguage={changeLanguage}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout changeLanguage={changeLanguage}>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout changeLanguage={changeLanguage}>
                <About />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout changeLanguage={changeLanguage}>
                <Contact />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </I18nProvider>
  );
}

export default App;
