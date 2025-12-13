import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

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

const Home = () => {
    const [province, setProvince] = useState("");
    const [districts, setDistricts] = useState([]);
    const navigate = useNavigate();
    const { t } = useLanguage();

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

    useEffect(() => {
        if (province && districtsData[province]) {
            setDistricts(districtsData[province]);
        } else {
            setDistricts([]);
        }
    }, [province]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/listings?province=${province}`);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {t('hero.title')}
                    </motion.h1>

                    <motion.div
                        className="search-box-container"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Form onSubmit={handleSearch}>
                            <Row className="g-3">
                                {/* Location Row */}
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-muted">{t('hero.location')}</Form.Label>
                                    <Form.Select className="bg-light mb-2" value={province} onChange={(e) => setProvince(e.target.value)}>
                                        <option value="">{t('hero.province')}</option>
                                        {provincesList.map(p => <option key={p} value={p}>{p}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-muted d-none d-md-block">&nbsp;</Form.Label>
                                    <Form.Select className="bg-light mb-2" name="district" disabled={!districts.length}>
                                        <option value="">{t('hero.district')}</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </Form.Select>
                                </Col>

                                {/* Criteria Row */}
                                <Col md={4} className="mt-3">
                                    <Form.Label className="fw-bold small text-muted">{t('hero.propertyType')}</Form.Label>
                                    <Form.Select className="bg-light">
                                        <option>{t('hero.allTypes')}</option>
                                        <option value="1">{t('hero.singleRoom')}</option>
                                        <option value="2">{t('hero.sharedRoom')}</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4} className="mt-3">
                                    <Form.Label className="fw-bold small text-muted">{t('hero.clientType')}</Form.Label>
                                    <Form.Select className="bg-light">
                                        <option>{t('hero.select')}</option>
                                        <option value="1">{t('hero.gender.girls')}</option>
                                        <option value="2">{t('hero.gender.boys')}</option>
                                        <option value="3">{t('hero.gender.couples')}</option>
                                        <option value="4">{t('hero.gender.family')}</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4} className="mt-3">
                                    <Form.Label className="fw-bold small text-muted">{t('hero.maxPrice')}</Form.Label>
                                    <Form.Select className="bg-light">
                                        <option>{t('hero.anyPrice')}</option>
                                        <option value="1">Rs. 5,000</option>
                                        <option value="2">Rs. 10,000</option>
                                        <option value="3">Rs. 20,000</option>
                                    </Form.Select>
                                </Col>

                                {/* Search Button */}
                                <Col md={12} className="mt-4">
                                    <Button variant="success" type="submit" className="w-100 py-2 fw-bold rounded-1">
                                        {t('hero.searchBtn')}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </motion.div>
                </div>
            </section>

            {/* Welcome Section */}
            <section id="about" className="section-padding bg-white">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <motion.img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="About Us"
                                className="img-fluid rounded shadow-lg"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
                            />
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
                            >
                                <h4 className="text-success fw-bold text-uppercase mb-2">{t('welcome.title')}</h4>
                                <h5 className="mb-4 fw-bold gradient-text">{t('welcome.sub')}</h5>
                                <p className="text-muted mb-4">
                                    {t('welcome.desc')}
                                </p>
                                <Row className="g-4 mb-4">
                                    <Col sm={6}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 btn-lg-square bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                                <i className="fas fa-check"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h6 className="mb-0 fw-bold">{t('welcome.verified')}</h6>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 btn-lg-square bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                                <i className="fas fa-clock"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h6 className="mb-0 fw-bold">{t('welcome.fast')}</h6>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Properties */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="section-title text-center mb-5">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >Featured Properties</motion.h2>
                        <p>Explore our hand-picked selection of the best boarding places available right now.</p>
                    </div>

                    <motion.div
                        className="row g-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Property Cards */}
                        {[
                            { title: "Modern Apartment", loc: "Colombo 03", price: "Rs. 25,000", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 2, baths: 1, area: "850 sqft" },
                            { title: "Cozy Annex", loc: "Kandy", price: "Rs. 15,000", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, baths: 1 },
                            { title: "Student Room", loc: "Malabe", price: "Rs. 8,000", img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, share: true }
                        ].map((prop, idx) => (
                            <Col md={4} key={idx}>
                                <motion.div className="property-card h-100" variants={fadeInUp} whileHover={{ y: -10 }}>
                                    <div className="property-img-wrapper">
                                        <span className="property-tag">For Rent</span>
                                        <img src={prop.img} alt="Property" />
                                        <span className="property-price-tag">{prop.price}</span>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{prop.title}</h5>
                                        <span className="card-location"><i className="fas fa-map-marker-alt me-1"></i> {prop.loc}</span>
                                        <div className="card-features">
                                            <span><i className="fas fa-bed"></i> {prop.beds} {prop.beds > 1 ? 'Beds' : 'Bed'}</span>
                                            <span><i className="fas fa-bath"></i> {prop.share ? 'Shared' : `${prop.baths} Bath`}</span>
                                            {prop.area && <span><i className="fas fa-ruler-combined"></i> {prop.area}</span>}
                                        </div>
                                        <Link to="/property/1" className="btn btn-success w-100 mt-3 rounded-0">VIEW DETAILS</Link>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </motion.div>

                    <div className="text-center mt-5">
                        <Link to="/listings" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold btn-pulse">BROWSE ALL PROPERTIES</Link>
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <Container>
                    <Row>
                        {[
                            { num: "1000+", label: "Happy Tenants" },
                            { num: "500+", label: "Properties" },
                            { num: "50+", label: "Cities" },
                            { num: "24/7", label: "Support" }
                        ].map((stat, idx) => (
                            <Col md={3} xs={6} key={idx}>
                                <motion.div
                                    className="stat-item"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="stat-number">{stat.num}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Home;
