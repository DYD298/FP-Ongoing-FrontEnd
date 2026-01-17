import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { AuthProvider } from "@asgardeo/auth-react";

const authConfig = {
    signInRedirectURL: window.location.origin,
    signOutRedirectURL: window.location.origin,
    clientID: "YOUR_ASGARDEO_CLIENT_ID", // Replace with your Asgardeo Client ID
    baseUrl: "https://api.asgardeo.io/t/YOUR_ORGANIZATION_NAME", // Replace with your Asgardeo Base URL
    scope: ["openid", "profile"]
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider config={authConfig}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>,
)
