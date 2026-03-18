import React, { useCallback, useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  fetchNotifications,
  markAllNotificationsRead
} from "../api/notificationsApi";
import { clearRoleAccessCache, resolveRoleAccess } from "../api/roleAccessApi";

const Navigation = () => {
  const { state, signOut, getAccessToken } = useAuthContext();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [roleAccess, setRoleAccess] = useState({ isAdmin: false, isSuperAdmin: false });

  const location = useLocation();
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    clearRoleAccessCache();
    await signOut();
  };

  const goToDashboard = () => navigate("/dashboard");
  const goToAdmin = () => navigate("/admin");
  const goToSuperAdmin = () => navigate("/super-admin");
  const goToPostAd = () => navigate("/post-ad");
  const goToMyAds = () => navigate("/my-ads");

  const isHome = location.pathname === "/";
  const isListings = location.pathname === "/listings";
  const isDashboard = location.pathname === "/dashboard";
  const isAdmin = location.pathname.startsWith("/admin");
  const isSuperAdmin = location.pathname.startsWith("/super-admin");
  const isMyAds = location.pathname === "/my-ads";
  const isPostAd = location.pathname === "/post-ad";
  const unreadCount = notifications.filter((item) => !item.is_read).length;
  const canAccessSuperAdmin = roleAccess.isSuperAdmin;
  const canAccessAdmin = roleAccess.isAdmin || roleAccess.isSuperAdmin;

  useEffect(() => {
    let isMounted = true;

    const loadRoleAccess = async () => {
      if (!state?.isAuthenticated) {
        if (isMounted) {
          setRoleAccess({ isAdmin: false, isSuperAdmin: false });
        }
        return;
      }

      try {
        const accessToken = await getAccessToken();
        const email = state?.email || state?.username || "";
        const data = await resolveRoleAccess(accessToken, email);

        if (isMounted) {
          setRoleAccess(data);
        }
      } catch {
        if (isMounted) {
          setRoleAccess({ isAdmin: false, isSuperAdmin: false });
        }
      }
    };

    loadRoleAccess();

    return () => {
      isMounted = false;
    };
  }, [getAccessToken, state?.email, state?.isAuthenticated, state?.username]);

  const loadNotifications = useCallback(async () => {
    if (!state?.isAuthenticated || !state?.email) {
      setNotifications([]);
      return;
    }

    try {
      setNotificationsLoading(true);
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const data = await fetchNotifications(accessToken, state.email);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [getAccessToken, state?.email, state?.isAuthenticated]);

  useEffect(() => {
    if (!state?.isAuthenticated || !state?.email) {
      setNotifications([]);
      return;
    }

    loadNotifications();
    const intervalId = setInterval(loadNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [loadNotifications, state?.email, state?.isAuthenticated]);

  const handleMarkAllNotificationsRead = async (e) => {
    e.stopPropagation();

    if (!state?.isAuthenticated || !state?.email || unreadCount === 0) {
      return;
    }

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      await markAllNotificationsRead(accessToken, state.email);
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true
        }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification?.ad_id) {
      navigate(`/property/${notification.ad_id}`);
    }
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString();
  };

  return (
    <>
      <div className="top-bar-fixed d-none d-lg-block">
        <Container>
          <div className="top-bar-container">
            <div className="top-bar-left">
              <a href="tel:+94714959596">
                <i className="fas fa-phone-alt me-1"></i>
                +94 714 95 95 96
              </a>
              <a href="mailto:info@ceylonstay.lk">
                <i className="fas fa-envelope me-1"></i>
                info@ceylonstay.lk
              </a>
            </div>

            <div className="top-bar-right social-links">
              <Dropdown className="me-2">
                <Dropdown.Toggle
                  variant="link"
                  id="language-dropdown"
                  className="p-0 text-decoration-none text-uppercase nav-icon-btn"
                >
                  {language}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={() => changeLanguage("en")}>
                    English
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLanguage("si")}>
                    Sinhala
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLanguage("ta")}>
                    Tamil
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button
                variant="link"
                className="p-0 text-decoration-none me-2 nav-icon-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              >
                <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
              </Button>

              <div className="d-flex gap-2">
                <a href="#" className="nav-icon-btn">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="nav-icon-btn">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="nav-icon-btn">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="nav-icon-btn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Navbar
        expand="lg"
        fixed="top"
        variant={theme}
        className={`main-navbar ${scrolled ? "navbar-scrolled" : ""}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            CEYLON STAY
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" active={isHome}>
                {t("nav.home")}
              </Nav.Link>

              <Nav.Link as={Link} to="/listings" active={isListings}>
                {t("nav.properties")}
              </Nav.Link>

              {location.pathname !== "/listings" && (
                <Nav.Link
                  href="#about"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.getElementById("about")?.scrollIntoView({
                        behavior: "smooth"
                      });
                    }
                  }}
                >
                  {t("nav.about")}
                </Nav.Link>
              )}

              <Nav.Link
                href="#contact"
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth"
                    });
                  }
                }}
              >
                {t("nav.contact")}
              </Nav.Link>

              <Nav.Link className="d-lg-none">
                <span
                  className="me-2"
                  onClick={() => changeLanguage("en")}
                  style={{
                    fontWeight: language === "en" ? "bold" : "normal",
                    cursor: "pointer"
                  }}
                >
                  EN
                </span>
                |
                <span
                  className="mx-2"
                  onClick={() => changeLanguage("si")}
                  style={{
                    fontWeight: language === "si" ? "bold" : "normal",
                    cursor: "pointer"
                  }}
                >
                  SI
                </span>
                |
                <span
                  className="ms-2"
                  onClick={() => changeLanguage("ta")}
                  style={{
                    fontWeight: language === "ta" ? "bold" : "normal",
                    cursor: "pointer"
                  }}
                >
                  TA
                </span>
              </Nav.Link>

              <Nav.Link onClick={toggleTheme} className="d-lg-none">
                <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"} me-2`}></i>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </Nav.Link>

              {state.isAuthenticated ? (
                <>
                  <Dropdown
                    align="end"
                    className="ms-3"
                    show={showNotifications}
                    onToggle={(nextShow) => {
                      setShowNotifications(nextShow);
                      if (nextShow) {
                        loadNotifications();
                      }
                    }}
                  >
                    <Dropdown.Toggle
                      variant="link"
                      className="p-0 text-decoration-none profile-toggle position-relative"
                      id="notifications-dropdown"
                    >
                      <div className="profile-avatar">
                        <i className="fas fa-bell fa-sm"></i>
                      </div>
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" style={{ minWidth: "320px" }}>
                      <div className="d-flex justify-content-between align-items-center px-3 py-2">
                        <span className="fw-bold">Notifications</span>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-success text-decoration-none"
                          onClick={handleMarkAllNotificationsRead}
                          disabled={unreadCount === 0}
                        >
                          Mark all read
                        </button>
                      </div>
                      <Dropdown.Divider />

                      {notificationsLoading ? (
                        <div className="px-3 py-3 text-muted small">Loading notifications...</div>
                      ) : notifications.length === 0 ? (
                        <div className="px-3 py-3 text-muted small">No notifications yet.</div>
                      ) : (
                        notifications.slice(0, 8).map((notification) => (
                          <Dropdown.Item
                            key={notification.id}
                            className="py-2"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="d-flex flex-column">
                              <span className={notification.is_read ? "text-muted" : "fw-semibold"}>
                                {notification.message}
                              </span>
                              <small className="text-muted">
                                {formatNotificationTime(notification.created_at)}
                              </small>
                            </div>
                          </Dropdown.Item>
                        ))
                      )}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown align="end" className="ms-3">
                  <Dropdown.Toggle
                    variant="link"
                    className="p-0 text-decoration-none profile-toggle"
                    id="profile-dropdown"
                  >
                    <div className="profile-avatar">
                      <i className="fas fa-user fa-sm"></i>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={goToDashboard} active={isDashboard}>
                      <i className="fas fa-th-large me-2"></i>
                      Dashboard
                    </Dropdown.Item>

                    {canAccessAdmin && (
                      <Dropdown.Item onClick={goToAdmin} active={isAdmin}>
                        <i className="fas fa-user-cog me-2"></i>
                        Admin
                      </Dropdown.Item>
                    )}

                    {canAccessSuperAdmin && (
                      <Dropdown.Item onClick={goToSuperAdmin} active={isSuperAdmin}>
                        <i className="fas fa-user-shield me-2"></i>
                        Super Admin
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item onClick={goToMyAds} active={isMyAds}>
                      <i className="fas fa-list me-2"></i>
                      My Ads
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={goToPostAd}
                      active={isPostAd}
                      className="text-success"
                    >
                      <i className="fas fa-home me-2"></i>
                      Post Ad
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="btn btn-success btn-sm ms-3 px-4 rounded-pill fw-bold nav-post-btn"
                >
                  {t("nav.postAd")}
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
