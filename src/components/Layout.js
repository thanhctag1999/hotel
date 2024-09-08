// src/components/Layout.js
import React from "react";
import Header from "./Header";

const Layout = ({ children, changeLanguage }) => {
  return (
    <div>
      <Header changeLanguage={changeLanguage} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
