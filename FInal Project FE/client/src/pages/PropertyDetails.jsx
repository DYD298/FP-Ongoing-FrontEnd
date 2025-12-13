import React from "react";
import { Container, Row, Col, Carousel, Card, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const PropertyDetails = () => {
    const { id } = useParams();
    const { t } = useLanguage();

    return (
        <div style={{ paddingTop: "100px", paddingBottom: "50px" }}>
            <Container>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">{t('property.breadcrumb.home')}</Link></li>
                        <li className="breadcrumb-item"><Link to="/listings">{t('property.breadcrumb.find')}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Modern Apartment</li>
                    </ol>
                </nav>

                <Row>
                    {/* Property Images & Details */}
                    <Col lg={8}>
                        {/* Image Gallery */}
                        <motion.div
                            className="mb-4 rounded-3 overflow-hidden shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Carousel>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                                        alt="Living Room"
                                        style={{ height: "500px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                                        alt="Bedroom"
                                        style={{ height: "500px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                                        alt="Kitchen"
                                        style={{ height: "500px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                            </Carousel>
                        </motion.div>

                        {/* Title & Price */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h1 className="h2 fw-bold">Modern Apartment in Colombo 03</h1>
                                <p className="text-muted mb-0"><i className="fas fa-map-marker-alt me-2"></i> 45, Galle Road, Colombo 03</p>
                            </div>
                            <div className="text-end">
                                <h3 className="text-success fw-bold mb-0">Rs. 25,000</h3>
                                <small className="text-muted">{t('property.perMonth')}</small>
                            </div>
                        </div>

                        <hr />

                        {/* Key Features */}
                        <Row className="text-center mb-4">
                            {[
                                { icon: "bed", label: "2 Beds" },
                                { icon: "bath", label: "1 Bath" },
                                { icon: "ruler-combined", label: "850 sqft" },
                                { icon: "couch", label: "Furnished" }
                            ].map((feat, idx) => (
                                <Col xs={3} key={idx}>
                                    <div className="p-3 bg-light rounded-3">
                                        <i className={`fas fa-${feat.icon} fa-2x text-success mb-2`}></i>
                                        <p className="mb-0 fw-bold">{feat.label}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        {/* Description */}
                        <h4 className="mb-3">{t('property.description')}</h4>
                        <p className="text-muted mb-4">
                            This beautiful modern apartment is located in the heart of Colombo 03, offering easy access to
                            public transport, supermarkets, and restaurants. The apartment is fully furnished and features a
                            spacious living area, a modern kitchen with appliances, and a comfortable bedroom with air
                            conditioning. Perfect for students or working professionals looking for a convenient and safe
                            place to stay.
                        </p>

                        {/* Facilities */}
                        <h4 className="mb-3">{t('property.facilities')}</h4>
                        <Row className="mb-5">
                            {["Air Conditioning", "Hot Water", "Washing Machine", "24/7 Security"].map((fac, idx) => (
                                <Col md={4} className="mb-2" key={idx}>
                                    <i className="fas fa-check text-success me-2"></i> {fac}
                                </Col>
                            ))}
                        </Row>

                        {/* Location Map */}
                        <h4 className="mb-3">{t('property.location')}</h4>
                        <div className="bg-light rounded-3 d-flex align-items-center justify-content-center overflow-hidden mb-4" style={{ height: "400px" }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.8497182996875!2d80.3548452745689!3d7.481841692530128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae33a22f7ef7d7d%3A0x1ea33b80e7201808!2sNational%20Institute%20of%20Business%20Management%20(NIBM)%20Kurunegala%20Centre!5e0!3m2!1sen!2ssg!4v1765206650214!5m2!1sen!2ssg"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </Col>

                    {/* Sidebar Contact */}
                    <Col lg={4}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            style={{ position: 'sticky', top: '100px', zIndex: 1 }}
                        >
                            <Card className="shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <Card.Title className="mb-4">{t('property.contactOwner')}</Card.Title>
                                    <div className="d-flex align-items-center mb-4">
                                        <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" className="rounded-circle me-3" width="60" alt="Owner" />
                                        <div>
                                            <h6 className="mb-0 fw-bold">John Doe</h6>
                                            <small className="text-muted">{t('property.memberSince')} 2021</small>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Button variant="success"><i className="fas fa-phone-alt me-2"></i> {t('property.showPhone')}</Button>
                                        <Button variant="outline-success"><i className="fas fa-envelope me-2"></i> {t('property.sendMessage')}</Button>
                                    </div>

                                    <hr className="my-4" />

                                    <h6 className="mb-3">{t('property.safety')}</h6>
                                    <ul className="text-muted small ps-3 mb-0">
                                        <li>{t('property.safety1')}</li>
                                        <li>{t('property.safety2')}</li>
                                        <li>{t('property.safety3')}</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PropertyDetails;
