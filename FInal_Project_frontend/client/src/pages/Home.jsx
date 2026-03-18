import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  MapPin,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Building2,
  CameraOff,
  BedDouble,
  Bath,
  Star
} from "lucide-react";
import {
  fetchActiveAds,
  getImageUrl,
  normalizeFacilities
} from "../api/adsApi";
import { fetchPublicAds } from "../api/searchApi";
import ProtectedImage from "../components/ProtectedImage";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14
    }
  }
};

const provincesList = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa"
];

const districtsData = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar"],
  Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"]
};

const Home = () => {
  const { state, getAccessToken } = useAuthContext();
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const navigate = useNavigate();
  const { t } = useLanguage();

  const districts = useMemo(() => {
    return province && districtsData[province] ? districtsData[province] : [];
  }, [province]);

  useEffect(() => {
    const fetchFeaturedAds = async () => {
      setLoadingFeatured(true);
      setFeaturedError("");

      try {
        if (state?.isAuthenticated) {
          const token = await getAccessToken();
          setAccessToken(token || "");
          const data = await fetchActiveAds(token);
          setFeaturedProperties(Array.isArray(data) ? data.slice(0, 6) : []);
        } else {
          setAccessToken("");
          const data = await fetchPublicAds({ limit: 6 });
          setFeaturedProperties(Array.isArray(data?.items) ? data.items : []);
        }
      } catch (err) {
        console.error("Failed to fetch featured ads:", err);
        if (!state?.isAuthenticated) {
          setFeaturedError(err.message || "Failed to fetch public listings.");
        } else {
          setFeaturedError(err.message || "Failed to fetch featured listings.");
        }
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedAds();
  }, [getAccessToken, state?.isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (province) params.set("province", province);
    if (district) params.set("district", district);
    if (propertyType) params.set("propertyType", propertyType);
    if (maxPrice) params.set("maxPrice", maxPrice);

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <>
      <section
        className="position-relative overflow-hidden"
        style={{
          minHeight: "100vh",
          paddingTop: "150px",
          paddingBottom: "80px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0
          }}
        >
          <source
            src="https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.80), rgba(15,23,42,0.55), rgba(16,185,129,0.32))",
            zIndex: 1
          }}
        />

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={9}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Badge
                    bg="light"
                    text="dark"
                    className="px-3 py-2 rounded-pill mb-4 fw-semibold"
                  >
                    Sri Lanka Student & Boarding Finder
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="display-4 fw-bold text-white mb-3"
                  style={{ lineHeight: 1.15 }}
                >
                  {t("hero.title") || "Find Your Perfect Stay with Confidence"}
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-white-50 mx-auto mb-5"
                  style={{ maxWidth: "760px", fontSize: "1.08rem" }}
                >
                  Search verified boarding houses, rooms, annexes, and apartments
                  across Sri Lanka with a cleaner, faster, and safer experience.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-4 shadow-lg p-4 p-md-5 text-start"
                style={{
                  background: "rgba(255,255,255,0.94)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Form onSubmit={handleSearch}>
                  <Row className="g-3">
                    <Col lg={6}>
                      <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                        <MapPin size={16} className="me-2" />
                        Province
                      </Form.Label>
                      <Form.Select
                        className="bg-light border-0 py-3 rounded-3 shadow-none"
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setDistrict("");
                        }}
                      >
                        <option value="">Select Province</option>
                        {provincesList.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col lg={6}>
                      <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                        <MapPin size={16} className="me-2" />
                        District
                      </Form.Label>
                      <Form.Select
                        className="bg-light border-0 py-3 rounded-3 shadow-none"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!districts.length}
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={6} lg={4}>
                      <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                        <Building2 size={16} className="me-2" />
                        Property Type
                      </Form.Label>
                      <Form.Select
                        className="bg-light border-0 py-3 rounded-3 shadow-none"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="boarding-house">Boarding House</option>
                        <option value="room">Single Room</option>
                        <option value="annex">Annex</option>
                        <option value="apartment">Apartment</option>
                      </Form.Select>
                    </Col>

                    <Col md={6} lg={4}>
                      <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                        <Users size={16} className="me-2" />
                        Intended For
                      </Form.Label>
                      <Form.Select className="bg-light border-0 py-3 rounded-3 shadow-none" disabled>
                        <option>Coming Soon</option>
                      </Form.Select>
                    </Col>

                    <Col md={12} lg={4}>
                      <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                        <span className="me-2">💰</span>
                        Max Price
                      </Form.Label>
                      <Form.Select
                        className="bg-light border-0 py-3 rounded-3 shadow-none"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      >
                        <option value="">Any Price</option>
                        <option value="5000">Rs. 5,000</option>
                        <option value="10000">Rs. 10,000</option>
                        <option value="20000">Rs. 20,000</option>
                        <option value="30000">Rs. 30,000</option>
                        <option value="50000">Rs. 50,000</option>
                      </Form.Select>
                    </Col>

                    <Col xs={12} className="mt-4">
                      <Button
                        variant="success"
                        type="submit"
                        className="w-100 py-3 fw-bold rounded-pill border-0 shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, #10b981, #14b8a6)",
                          fontSize: "1.05rem"
                        }}
                      >
                        Search Listings <ArrowRight size={20} className="ms-2" />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="about" className="py-5 bg-white">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="position-relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
                  alt="About Ceylon Stay"
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div
                  className="position-absolute bottom-0 end-0 p-4 rounded-4 text-white fw-bold shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #14b8a6)",
                    transform: "translate(18px, 18px)"
                  }}
                >
                  <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>1000+</div>
                  <div className="small">Happy Users</div>
                </div>
              </motion.div>
            </Col>

            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge bg="success" bgOpacity="10" text="success" className="mb-3 px-3 py-2 rounded-pill">
                  Why Choose Us
                </Badge>

                <h2 className="fw-bold mb-4">Your Perfect Home Awaits</h2>
                <p className="text-muted mb-4 lead">
                  {t("welcome.desc") ||
                    "We help students, professionals, and families find trusted places to stay with better visibility, faster search, and a safer rental journey."}
                </p>

                <Row className="g-4 mb-4">
                  <Col sm={6}>
                    <div className="d-flex align-items-center gap-3">
                      <Shield className="text-success" size={24} />
                      <div>
                        <div className="fw-semibold">Verified Listings</div>
                        <div className="text-muted small">Better trust and visibility</div>
                      </div>
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="d-flex align-items-center gap-3">
                      <Zap className="text-success" size={24} />
                      <div>
                        <div className="fw-semibold">Fast Search</div>
                        <div className="text-muted small">Simple filtering and browsing</div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Link
                  to="/listings"
                  className="btn btn-success rounded-pill px-5 py-3 fw-bold shadow-lg border-0"
                  style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}
                >
                  Explore Properties <ArrowRight size={18} className="ms-2" />
                </Link>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <Badge
              bg="success"
              bgOpacity="10"
              text="success"
              className="fw-semibold px-3 py-2 mb-3 rounded-pill"
            >
              Featured Listings
            </Badge>
            <h2 className="fw-bold mb-2">Explore Popular Properties</h2>
            <p className="text-muted mb-0">
              Fresh active listings from the Ceylon Stay ads service.
            </p>
          </div>

          {loadingFeatured ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : featuredError ? (
            <div className="alert alert-danger rounded-4 text-center">
              {featuredError}
            </div>
          ) : featuredProperties.length > 0 ? (
            <motion.div
              className="row g-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProperties.map((prop) => {
                const facilities = normalizeFacilities(prop.facilities);
                return (
                  <Col md={6} xl={4} key={prop.id}>
                    <motion.div
                      variants={fadeInUp}
                      whileHover={{ y: -8 }}
                      className="h-100"
                    >
                      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                        <div style={{ height: "250px", position: "relative", background: "#eef2f7" }}>
                          <ProtectedImage
                            imageUrl={getImageUrl(prop.images?.[0], {
                              usePublic: !state?.isAuthenticated
                            })}
                            token={accessToken}
                            className="w-100 h-100 object-fit-cover"
                            alt={prop.title || "Property"}
                            fallbackSrc="https://placehold.co/800x520?text=Property"
                          />

                          <Badge
                            bg="danger"
                            className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill"
                          >
                            Rs. {Number(prop.price || 0).toLocaleString()}
                          </Badge>
                        </div>

                        <div className="card-body p-4">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Star size={16} className="text-warning" fill="currentColor" />
                            <small className="text-muted fw-semibold">Featured Property</small>
                          </div>

                          <h5 className="fw-bold text-dark text-truncate mb-2">
                            {prop.title || "Untitled Property"}
                          </h5>

                          <p className="text-muted small mb-3 d-flex align-items-center gap-1">
                            <MapPin size={14} className="text-success" />
                            {[prop.district, prop.province].filter(Boolean).join(", ") || "Location not available"}
                          </p>

                          <div className="d-flex gap-3 small text-muted mb-3">
                            <span className="d-flex align-items-center gap-1">
                              <BedDouble size={15} className="text-success" />
                              {prop.beds ?? 0} Beds
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <Bath size={15} className="text-success" />
                              {prop.baths ?? 0} Baths
                            </span>
                          </div>

                          <div className="mb-3">
                            {facilities.slice(0, 3).map((item) => (
                              <Badge
                                key={item}
                                bg="light"
                                text="dark"
                                className="me-2 mb-2 rounded-pill px-3 py-2"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>

                          <Link
                            to={`/property/${prop.id}`}
                            className="btn btn-success w-100 fw-bold rounded-pill py-2 border-0"
                            style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}
                          >
                            View Details <ArrowRight size={16} className="ms-2" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </Col>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-5 text-muted">
              <CameraOff size={42} className="mb-3 opacity-50" />
              <div className="fw-semibold">No featured properties found.</div>
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/listings" className="btn btn-outline-success rounded-pill px-4 fw-semibold">
              View All Listings
            </Link>
          </div>
        </Container>
      </section>

      <section
        className="py-5"
        style={{ background: "linear-gradient(135deg, #0f172a, #111827, #0f766e)" }}
      >
        <Container>
          <Row className="text-center text-white g-4">
            <Col xs={6} md={3}>
              <h3 className="fw-bold mb-1">1000+</h3>
              <p className="mb-0 text-white-50">Tenants</p>
            </Col>
            <Col xs={6} md={3}>
              <h3 className="fw-bold mb-1">500+</h3>
              <p className="mb-0 text-white-50">Properties</p>
            </Col>
            <Col xs={6} md={3}>
              <h3 className="fw-bold mb-1">50+</h3>
              <p className="mb-0 text-white-50">Cities</p>
            </Col>
            <Col xs={6} md={3}>
              <h3 className="fw-bold mb-1">24/7</h3>
              <p className="mb-0 text-white-50">Support</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
