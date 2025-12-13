import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const properties = [
    { id: 1, title: "Modern Apartment", loc: "Colombo 03", price: "Rs. 25,000", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 2, baths: 1, area: "850 sqft" },
    { id: 2, title: "Cozy Annex", loc: "Kandy", price: "Rs. 15,000", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, baths: 1 },
    { id: 3, title: "Student Room", loc: "Malabe", price: "Rs. 8,000", img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, share: true, kitchen: true },
    { id: 4, title: "Luxury Room", loc: "Nugegoda", price: "Rs. 18,000", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, bath: "Private", ac: true },
    { id: 5, title: "Spacious House", loc: "Gampaha", price: "Rs. 35,000", img: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 3, baths: 2 },
    { id: 6, title: "City View Studio", loc: "Dehiwala", price: "Rs. 22,000", img: "https://images.unsplash.com/photo-1499916078039-92237843f636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, baths: 1 },
];

const Listings = () => {
    const { t } = useLanguage();

    return (
        <div style={{ paddingTop: "100px", paddingBottom: "50px" }}>
            <div className="bg-success py-5 mb-5 mt-n5">
                <Container className="text-center text-white">
                    <motion.h2
                        className="mt-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >{t('listings.title')}</motion.h2>
                    <p className="lead">{t('listings.subtitle')}</p>
                </Container>
            </div>

            <Container>
                <Row>
                    {/* Sidebar Filters */}
                    <Col lg={3} className="mb-4">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <Card.Title className="mb-4"><i className="fas fa-filter me-2"></i>{t('listings.filters')}</Card.Title>
                                    <Form>
                                        <div className="mb-4">
                                            <Form.Label className="fw-bold">{t('listings.facilities')}</Form.Label>
                                            <Form.Check type="checkbox" label="Attached Bathroom" id="fac2" />
                                            <Form.Check type="checkbox" label="Kitchen" id="fac3" />

                                        </div>
                                        <Button variant="success" className="w-100">{t('listings.apply')}</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Listings Grid */}
                    <Col lg={9}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <p className="mb-0 text-muted">{t('listings.showing')} <strong>{properties.length}</strong> {t('listings.results')}</p>
                            <Form.Select className="w-auto">
                                <option>{t('listings.sort')}: {t('listings.newest')}</option>
                                <option value="1">{t('listings.priceLow')}</option>
                                <option value="2">{t('listings.priceHigh')}</option>
                            </Form.Select>
                        </div>

                        <Row className="g-4">
                            {properties.map((prop, idx) => (
                                <Col md={6} key={prop.id}>
                                    <motion.div
                                        className="property-card h-100"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="property-img-wrapper">
                                            <span className="property-tag">For Rent</span>
                                            <img src={prop.img} alt="Property" />
                                            <span className="property-price-tag">{prop.price}</span>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title mb-1">{prop.title}</h5>
                                            <p className="card-location"><i className="fas fa-map-marker-alt me-1"></i> {prop.loc}</p>

                                            <div className="card-features">
                                                <span><i className="fas fa-bed"></i> {prop.beds} {t('listings.beds')}</span>
                                                <span><i className="fas fa-bath"></i> {prop.share ? t('listings.shared') : prop.bath || (prop.baths + ' ' + t('listings.bath'))}</span>
                                                {prop.ac && <span><i className="fas fa-wind"></i> {t('listings.ac')}</span>}
                                                {prop.kitchen && <span><i className="fas fa-utensils"></i> {t('listings.kitchen')}</span>}
                                            </div>

                                            <Link to={`/property/${prop.id}`} className="btn btn-outline-success w-100 mt-3 rounded-0">{t('listings.viewDetails')}</Link>
                                        </div>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        <div className="mt-5 d-flex justify-content-center">
                            <ul className="pagination">
                                <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item"><a className="page-link" href="#">Next</a></li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Listings;
