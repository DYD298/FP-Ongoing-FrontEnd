import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';


import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { AuthProvider } from "@asgardeo/auth-react";


const authConfig = {
    signInRedirectURL: "http://localhost:5173/login",
    signOutRedirectURL: "http://localhost:5173/login",
    clientID: "ShNnrI1KiyD2ASWNqUOAfGas0xYa", 
    baseUrl: "https://localhost:9444", 
    scope: ["openid", "profile", "email"],
    storage: "sessionStorage" 
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {
    }
    <AuthProvider config={authConfig}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);