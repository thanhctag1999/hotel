// src/i18n/provider.js
import React, { Fragment } from "react";
import { IntlProvider } from "react-intl";
import { LOCALES } from "./locales";
import messages from "./messages"; // Corrected import

const Provider = ({ children, locale = LOCALES.ENGLISH }) => {
  return (
    <IntlProvider
      locale={locale}
      textComponent={Fragment}
      messages={messages[locale]} // Access the messages for the current locale
    >
      {children}
    </IntlProvider>
  );
};

export default Provider;
