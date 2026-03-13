import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { AuthProvider } from "@asgardeo/auth-react";

const authConfig = {
  signInRedirectURL: "http://localhost:5173/login",
  signOutRedirectURL: "http://localhost:5173/login",
  clientID: "c9_3j8Ah90DvvDzSmFLd6eAtH6Ya",
  baseUrl: "https://api.asgardeo.io/t/cyclonestay",
  scope: ["openid", "profile", "email"],
  storage: "sessionStorage",
  enablePKCE: true,
  responseMode: "query"
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider config={authConfig}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);