import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  Navigate
} from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

import Navigation from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PostAd from "./pages/PostAd";
import MyAds from "./pages/MyAds";
import EditDraftAd from "./pages/EditDraftAd";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { resolveRoleAccess } from "./api/roleAccessApi";

const ProtectedRoute = ({ children }) => {
  const { state } = useAuthContext();

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleProtectedRoute = ({ children, role }) => {
  const { state, getAccessToken } = useAuthContext();
  const [checkingRole, setCheckingRole] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (state.isLoading) return;

      if (!state.isAuthenticated) {
        if (isMounted) {
          setHasAccess(false);
          setCheckingRole(false);
        }
        return;
      }

      if (isMounted) {
        setCheckingRole(true);
      }

      try {
        const accessToken = await getAccessToken();
        const email = state?.email || state?.username || "";

        const access = await resolveRoleAccess(accessToken, email);
        const allowed =
          role === "super_admin"
            ? access.isSuperAdmin
            : access.isAdmin || access.isSuperAdmin;

        if (isMounted) {
          setHasAccess(allowed);
        }
      } catch {
        if (isMounted) {
          setHasAccess(false);
        }
      } finally {
        if (isMounted) {
          setCheckingRole(false);
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [
    getAccessToken,
    role,
    state?.email,
    state?.isAuthenticated,
    state?.isLoading,
    state?.username
  ]);

  if (state.isLoading || checkingRole) {
    return <div>Loading...</div>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

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
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public + layout routes */}
        <Route element={<LayoutContainer />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/my-ads"
            element={
              <ProtectedRoute>
                <MyAds />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ads/edit-draft/:adId"
            element={
              <ProtectedRoute>
                <EditDraftAd />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin"
            element={
              <RoleProtectedRoute role="super_admin">
                <SuperAdminDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/super-admin/admins"
            element={
              <RoleProtectedRoute role="super_admin">
                <SuperAdminDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <RoleProtectedRoute role="admin">
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RoleProtectedRoute role="admin">
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes without layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-ad"
          element={
            <ProtectedRoute>
              <PostAd />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
