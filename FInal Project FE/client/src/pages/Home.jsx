import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin, Users, Shield, Zap, Home as HomeIcon, ArrowRight, Star, Building2 } from "lucide-react";

// Animation Variants
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

const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
};

// Data
const provincesList = ["Western", "Central", "Southern", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"];
// Mock Districts for demo
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
    const navigate = useNavigate();
    const { t } = useLanguage();

    const districts = province && districtsData[province] ? districtsData[province] : [];

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
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay" style={{ zIndex: 1 }}></div>
                <div className="hero-content">
                    <motion.h1
                        className="hero-title"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 1 },
                            visible: {
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {t('hero.title').split("").map((char, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
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
                                    {/* Location Row */}
                                    <Col lg={6}>
                                        <div>
                                            <Form.Label className="fw-bold small text-uppercase text-muted mb-2">
                                                <MapPin size={16} className="me-2" />{t('hero.location')}
                                            </Form.Label>
                                            <Form.Select 
                                                className="bg-light border-0 py-3 rounded-3" 
                                                value={province} 
                                                onChange={(e) => {
                                                    setProvince(e.target.value);
                                                    setSelectedDistrict("");
                                                }}
                                            >
                                                <option value="">{t('hero.province')}</option>
                                                {provincesList.map(p => <option key={p} value={p}>{p}</option>)}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div>
                                            <Form.Label className="fw-bold small text-uppercase text-muted mb-2 d-none d-lg-block">&nbsp;</Form.Label>
                                            <Form.Select 
                                                className="bg-light border-0 py-3 rounded-3" 
                                                value={selectedDistrict}
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                disabled={!districts.length}
                                            >
                                                <option value="">{t('hero.district')}</option>
                                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                            </Form.Select>
                                        </div>
                                    </Col>

                                    {/* Criteria Row */}
                                    <Col md={4}>
                                        <div>
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
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div>
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
                                                <option value="family">{t('hero.gender.family')}</option>
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div>
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
                                                <option value="50000">Rs. 50,000</option>
                                            </Form.Select>
                                        </div>
                                    </Col>

                                    {/* Search Button */}
                                    <Col md={12} className="mt-4">
                                        <Button 
                                            variant="success" 
                                            type="submit" 
                                            className="w-100 py-3 fw-bold rounded-pill shadow-lg"
                                            style={{ background: 'var(--primary-gradient)', border: 'none', fontSize: '1.1rem' }}
                                        >
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
                        <Col lg={5} className="mb-4 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="position-relative"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="About Us"
                                    className="img-fluid rounded-4 shadow-lg"
                                />
                                <div 
                                    className="position-absolute bottom-0 end-0 p-4 rounded-3 text-white fw-bold shadow-lg"
                                    style={{ background: 'var(--primary-gradient)', transform: 'translate(20px, 20px)' }}
                                >
                                    <div style={{ fontSize: '2.5rem' }}>1000+</div>
                                    <div className="small">Happy Users</div>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={7}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-3">
                                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2">Why Choose Us</span>
                                </div>
                                <h2 className="fw-bold mb-4 lh-base" style={{ fontSize: '2.5rem', color: '#1a1a1a' }}>
                                    Your Perfect Home Awaits
                                </h2>
                                <p className="text-muted mb-5 lead" style={{ lineHeight: '1.8' }}>
                                    {t('welcome.desc')} Discover verified properties, transparent pricing, and professional support throughout your journey. We make finding your ideal accommodation simple and secure.
                                </p>
                                
                                <Row className="g-4 mb-5">
                                    <Col sm={6}>
                                        <motion.div 
                                            className="d-flex align-items-start"
                                            whileHover={{ x: 10 }}
                                        >
                                            <div className="flex-shrink-0 btn-lg-square bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, minWidth: 60 }}>
                                                <Shield size={24} />
                                            </div>
                                            <div className="ms-4">
                                                <h6 className="mb-2 fw-bold text-dark">Verified Properties</h6>
                                                <p className="text-muted small mb-0">All listings are verified and authentic</p>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col sm={6}>
                                        <motion.div 
                                            className="d-flex align-items-start"
                                            whileHover={{ x: 10 }}
                                        >
                                            <div className="flex-shrink-0 btn-lg-square bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, minWidth: 60 }}>
                                                <Zap size={24} />
                                            </div>
                                            <div className="ms-4">
                                                <h6 className="mb-2 fw-bold text-dark">Fast & Easy</h6>
                                                <p className="text-muted small mb-0">Find your home in minutes</p>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col sm={6}>
                                        <motion.div 
                                            className="d-flex align-items-start"
                                            whileHover={{ x: 10 }}
                                        >
                                            <div className="flex-shrink-0 btn-lg-square bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, minWidth: 60 }}>
                                                <MapPin size={24} />
                                            </div>
                                            <div className="ms-4">
                                                <h6 className="mb-2 fw-bold text-dark">50+ Cities</h6>
                                                <p className="text-muted small mb-0">Discover across Sri Lanka</p>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col sm={6}>
                                        <motion.div 
                                            className="d-flex align-items-start"
                                            whileHover={{ x: 10 }}
                                        >
                                            <div className="flex-shrink-0 btn-lg-square bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, minWidth: 60 }}>
                                                <Users size={24} />
                                            </div>
                                            <div className="ms-4">
                                                <h6 className="mb-2 fw-bold text-dark">24/7 Support</h6>
                                                <p className="text-muted small mb-0">Always here to help</p>
                                            </div>
                                        </motion.div>
                                    </Col>
                                </Row>

                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link to="/listings" className="btn btn-success rounded-pill px-5 py-3 fw-bold shadow-lg" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                                        Explore Properties <ArrowRight size={18} className="ms-2" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Properties */}
            <section className="section-padding bg-light">
                <Container>
                    <motion.div 
                        className="text-center mb-5"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 mb-3 d-inline-block">Our Collection</span>
                        <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#1a1a1a' }}>Featured Properties</h2>
                        <p className="text-muted lead" style={{ maxWidth: '600px', margin: '0 auto' }}>Explore our hand-picked selection of the best boarding places available right now across Sri Lanka.</p>
                    </motion.div>

                    <motion.div
                        className="row g-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Property Cards */}
                        {[
                            { title: "Modern Apartment", loc: "Colombo 03", price: "Rs. 25,000", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 2, baths: 1, area: "850 sqft", rating: 4.8 },
                            { title: "Cozy Annex", loc: "Kandy", price: "Rs. 15,000", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, baths: 1, rating: 4.7 },
                            { title: "Student Room", loc: "Malabe", price: "Rs. 8,000", img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, share: true, rating: 4.9 }
                        ].map((prop, idx) => (
                            <Col md={4} key={idx}>
                                <motion.div 
                                    className="property-card h-100 rounded-4 overflow-hidden shadow-lg border-0"
                                    variants={fadeInUp}
                                    whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                    style={{ background: 'white' }}
                                >
                                    <div className="property-img-wrapper position-relative overflow-hidden" style={{ height: '250px' }}>
                                        <span className="property-tag position-absolute top-3 start-3 badge bg-success fw-bold px-3 py-2">For Rent</span>
                                        <motion.img 
                                            src={prop.img} 
                                            alt="Property"
                                            className="w-100 h-100 object-fit-cover"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <span className="position-absolute bottom-3 end-3 badge bg-danger fw-bold px-3 py-2">{prop.price}</span>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="card-title fw-bold mb-1 text-dark">{prop.title}</h5>
                                                <span className="text-muted small"><MapPin size={14} className="me-1" /> {prop.loc}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1 bg-success bg-opacity-10 px-2 py-1 rounded-2" style={{ whiteSpace: 'nowrap' }}>
                                                <Star size={14} className="text-warning" fill="currentColor" />
                                                <span className="small fw-bold text-dark">{prop.rating}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="card-features d-flex gap-3 mb-4 flex-wrap">
                                            <span className="text-muted small"><i className="fas fa-bed me-1 text-success"></i> {prop.beds} {prop.beds > 1 ? 'Beds' : 'Bed'}</span>
                                            <span className="text-muted small"><i className="fas fa-bath me-1 text-success"></i> {prop.share ? 'Shared' : `${prop.baths} Bath`}</span>
                                            {prop.area && <span className="text-muted small"><i className="fas fa-ruler-combined me-1 text-success"></i> {prop.area}</span>}
                                        </div>
                                        
                                        <motion.div whileHover={{ scale: 1.02 }}>
                                            <Link to="/property/1" className="btn btn-success w-100 fw-bold rounded-pill py-2 shadow-sm" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                                                VIEW DETAILS <ArrowRight size={16} className="ms-2" />
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </motion.div>

                    <motion.div 
                        className="text-center mt-5"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/listings" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold btn-lg shadow-sm hover-shadow" style={{ fontSize: '1.1rem' }}>
                            BROWSE ALL PROPERTIES <ArrowRight size={20} className="ms-2" />
                        </Link>
                    </motion.div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-5" style={{ background: 'var(--primary-gradient)' }}>
                <Container>
                    <Row className="text-center text-white">
                        {[
                            { num: "1000+", label: "Happy Tenants", icon: "👥" },
                            { num: "500+", label: "Properties", icon: "🏠" },
                            { num: "50+", label: "Cities", icon: "🗺️" },
                            { num: "24/7", label: "Support", icon: "💬" }
                        ].map((stat, idx) => (
                            <Col md={3} xs={6} key={idx}>
                                <motion.div
                                    className="py-5"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div style={{ fontSize: '3rem' }} className="mb-3">{stat.icon}</div>
                                    <div className="fw-bold" style={{ fontSize: '2.5rem' }}>{stat.num}</div>
                                    <div className="text-white text-opacity-90 mt-2">{stat.label}</div>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-light">
                <Container>
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#1a1a1a' }}>
                            Ready to Find Your Perfect Home?
                        </h2>
                        <p className="text-muted mb-5 lead">Join thousands of satisfied tenants who found their ideal accommodation through Ceylon Stay</p>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link to="/listings" className="btn btn-success btn-lg rounded-pill px-5 fw-bold shadow-lg" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                                    Explore Properties
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link to="/register" className="btn btn-outline-success btn-lg rounded-pill px-5 fw-bold">
                                    Post Your Property
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </>
    );
};

export default Home;
