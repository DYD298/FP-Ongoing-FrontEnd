import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navigation from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PostAd from "./pages/PostAd";
import { useEffect } from "react";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LayoutContainer = () => {
  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<LayoutContainer />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-ad" element={<PostAd />} />
      </Routes>
    </Router>
  );
};

export default App;
