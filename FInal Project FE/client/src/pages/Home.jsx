import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin, Users, Shield, Zap, Home as HomeIcon, ArrowRight, Star, Building2, CameraOff } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

// Data
const provincesList = ["Western", "Central", "Southern", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"];
const districtsData = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar"],
    "Eastern": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

const Home = () => {
    const [province, setProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [clientType, setClientType] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    
    // NEW: State for fetching real data
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { t } = useLanguage();

    const districts = province && districtsData[province] ? districtsData[province] : [];

    // NEW: Fetch active ads from FastAPI on load
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch("http://localhost:8001/ads/active");
                const data = await response.json();
                setFeaturedProperties(data.slice(0, 3)); // Display first 3 ads
            } catch (err) {
                console.error("Failed to fetch featured ads:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    // Helper for Image Proxy
    const getImageUrl = (imgName) => {
        if (!imgName) return "https://placehold.co/600x400?text=No+Image";
        const API_BASE_URL = "http://localhost:8001";
        const cleanedName = imgName.replace("boarding-images/", "").replace(/^\/+/, "");
        return `${API_BASE_URL}/ads/image/${encodeURIComponent(cleanedName)}`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (province) params.append("province", province);
        if (selectedDistrict) params.append("district", selectedDistrict);
        if (propertyType) params.append("propertyType", propertyType);
        if (clientType) params.append("clientType", clientType);
        if (maxPrice) params.append("maxPrice", maxPrice);
        
        navigate(`/listings?${params.toString()}`);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section" style={{ paddingTop: '120px', marginTop: '0' }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        top: 0,
                        left: 0,
                        zIndex: 0
                    }}
                >
                    <source src="https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay" style={{ zIndex: 1 }}></div>
                <div className="hero-content">
                    <motion.h1
                        className="hero-title"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 1 },
                            visible: { transition: { staggerChildren: 0.05 } }
                        }}
                    >
                        {t('hero.title').split("").map((char, index) => (
                            <motion.span key={index} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}>
                                {char}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <motion.div
                        className="search-box-container"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="search-box-wrapper rounded-4 shadow-lg p-5" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                            <Form onSubmit={handleSearch}>
                                <Row className="g-3">
                                    <Col lg={6}>
                                        <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                                            <MapPin size={16} className="me-2" />{t('hero.location')}
                                        </Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-3 rounded-3 shadow-none" 
                                            value={province} 
                                            onChange={(e) => {
                                                setProvince(e.target.value);
                                                setSelectedDistrict("");
                                            }}
                                        >
                                            <option value="">{t('hero.province')}</option>
                                            {provincesList.map(p => <option key={p} value={p}>{p}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Label className="fw-bold small text-uppercase text-muted mb-2 d-none d-lg-block">&nbsp;</Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-3 rounded-3 shadow-none" 
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            disabled={!districts.length}
                                        >
                                            <option value="">{t('hero.district')}</option>
                                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </Form.Select>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                                            <Building2 size={16} className="me-2" />{t('hero.propertyType')}
                                        </Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-3 rounded-3"
                                            value={propertyType}
                                            onChange={(e) => setPropertyType(e.target.value)}
                                        >
                                            <option value="">{t('hero.allTypes')}</option>
                                            <option value="single-room">{t('hero.singleRoom')}</option>
                                            <option value="shared-room">{t('hero.sharedRoom')}</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                                            <Users size={16} className="me-2" />{t('hero.clientType')}
                                        </Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-3 rounded-3"
                                            value={clientType}
                                            onChange={(e) => setClientType(e.target.value)}
                                        >
                                            <option value="">{t('hero.select')}</option>
                                            <option value="girls">{t('hero.gender.girls')}</option>
                                            <option value="boys">{t('hero.gender.boys')}</option>
                                            <option value="couples">{t('hero.gender.couples')}</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                                            <span className="me-2">💰</span>{t('hero.maxPrice')}
                                        </Form.Label>
                                        <Form.Select 
                                            className="bg-light border-0 py-3 rounded-3"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        >
                                            <option value="">{t('hero.anyPrice')}</option>
                                            <option value="5000">Rs. 5,000</option>
                                            <option value="10000">Rs. 10,000</option>
                                            <option value="20000">Rs. 20,000</option>
                                        </Form.Select>
                                    </Col>

                                    <Col md={12} className="mt-4">
                                        <Button variant="success" type="submit" className="w-100 py-3 fw-bold rounded-pill shadow-lg border-0" style={{ background: 'var(--primary-gradient)', fontSize: '1.1rem' }}>
                                            {t('hero.searchBtn')} <ArrowRight size={20} className="ms-2" />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Welcome Section */}
            <section id="about" className="section-padding bg-white">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={5}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="position-relative">
                                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" alt="About" className="img-fluid rounded-4 shadow-lg" />
                                <div className="position-absolute bottom-0 end-0 p-4 rounded-3 text-white fw-bold shadow-lg" style={{ background: 'var(--primary-gradient)', transform: 'translate(20px, 20px)' }}>
                                    <div style={{ fontSize: '2.5rem' }}>1000+</div>
                                    <div className="small">Happy Users</div>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={7}>
                            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <h2 className="fw-bold mb-4">Your Perfect Home Awaits</h2>
                                <p className="text-muted mb-5 lead">{t('welcome.desc')}</p>
                                <Row className="g-4 mb-5">
                                    <Col sm={6}><Shield size={24} className="text-success me-2"/> Verified Properties</Col>
                                    <Col sm={6}><Zap size={24} className="text-success me-2"/> Fast & Easy</Col>
                                </Row>
                                <Link to="/listings" className="btn btn-success rounded-pill px-5 py-3 fw-bold shadow-lg" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                                    Explore Properties <ArrowRight size={18} className="ms-2" />
                                </Link>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* OUR COLLECTION (Dynamic Section) */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="text-center mb-5">
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 mb-3 d-inline-block">Our Collection</span>
                        <h2 className="fw-bold mb-3">Featured Properties</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
                    ) : featuredProperties.length > 0 ? (
                        <motion.div className="row g-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            {featuredProperties.map((prop) => (
                                <Col md={4} key={prop.id}>
                                    <motion.div variants={fadeInUp} className="property-card h-100 rounded-4 overflow-hidden shadow-lg bg-white border-0" whileHover={{ y: -10 }}>
                                        <div style={{ height: '250px', position: 'relative' }}>
                                            <img 
                                                src={getImageUrl(prop.images?.[0])} 
                                                className="w-100 h-100 object-fit-cover" 
                                                alt={prop.title}
                                                onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Property"; }}
                                            />
                                            <span className="position-absolute bottom-3 end-3 badge bg-danger fw-bold px-3 py-2">Rs. {prop.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="card-body p-4">
                                            <h5 className="fw-bold text-dark text-truncate">{prop.title}</h5>
                                            <p className="text-muted small mb-3"><MapPin size={14} className="me-1 text-success"/> {prop.district}</p>
                                            <Link to={`/property/${prop.id}`} className="btn btn-success w-100 fw-bold rounded-pill py-2 shadow-sm" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                                                VIEW DETAILS <ArrowRight size={16} className="ms-2" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </Col>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <CameraOff size={40} className="mb-2 opacity-50" /><br/>No properties found.
                        </div>
                    )}
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-5" style={{ background: 'var(--primary-gradient)' }}>
                <Container>
                    <Row className="text-center text-white">
                        <Col xs={6} md={3} className="py-3"><h3>1000+</h3><p>Tenants</p></Col>
                        <Col xs={6} md={3} className="py-3"><h3>500+</h3><p>Properties</p></Col>
                        <Col xs={6} md={3} className="py-3"><h3>50+</h3><p>Cities</p></Col>
                        <Col xs={6} md={3} className="py-3"><h3>24/7</h3><p>Support</p></Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Home;