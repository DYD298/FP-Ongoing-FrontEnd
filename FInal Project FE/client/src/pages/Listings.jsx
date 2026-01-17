import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin } from "lucide-react";

// Mock data for properties
const propertiesData = [
    { id: 1, title: "Modern Apartment", loc: "Colombo 03", province: "Western", district: "Colombo", type: "single-room", client: "family", price: 25000, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 2, baths: 1, area: "850 sqft", bathroom: true, kitchen: true },
    { id: 2, title: "Cozy Annex", loc: "Kandy", province: "Central", district: "Kandy", type: "shared-room", client: "boys", price: 15000, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, baths: 1, bathroom: true, kitchen: false },
    { id: 3, title: "Student Room", loc: "Malabe", province: "Western", district: "Colombo", type: "single-room", client: "girls", price: 8000, img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, share: true, kitchen: true, bathroom: false },
    { id: 4, title: "Luxury Room", loc: "Nugegoda", province: "Western", district: "Colombo", type: "single-room", client: "couples", price: 18000, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, bath: "Private", ac: true, bathroom: true, kitchen: true },
    { id: 5, title: "Spacious House", loc: "Gampaha", province: "Western", district: "Gampaha", type: "shared-room", client: "family", price: 35000, img: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 3, baths: 2, bathroom: true, kitchen: true },
    { id: 6, title: "City View Studio", loc: "Dehiwala", province: "Western", district: "Colombo", type: "single-room", client: "girls", price: 22000, img: "https://images.unsplash.com/photo-1499916078039-92237843f636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", beds: 1, baths: 1, bathroom: true, kitchen: false },
];

const Listings = () => {
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    // Local filter state
    const [filters, setFilters] = useState({
        province: searchParams.get("province") || "",
        district: searchParams.get("district") || "",
        propertyType: searchParams.get("propertyType") || "",
        clientType: searchParams.get("clientType") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        //additional
        attachedBathroom: searchParams.get("attachedBathroom") === "true",
        kitchen: searchParams.get("kitchen") === "true"
    });

    const filteredProperties = React.useMemo(() => {
        const province = searchParams.get("province");
        const district = searchParams.get("district");
        const propertyType = searchParams.get("propertyType");
        const clientType = searchParams.get("clientType");
        const maxPrice = searchParams.get("maxPrice");
        const bathroom = searchParams.get("attachedBathroom") === "true";
        const kitchen = searchParams.get("kitchen") === "true";

        return propertiesData.filter(prop => {
            if (province && prop.province !== province) return false;
            if (district && prop.district !== district) return false;
            if (propertyType && prop.type !== propertyType) return false;
            if (clientType && prop.client !== clientType) return false;
            if (maxPrice && prop.price > parseInt(maxPrice)) return false;
            if (bathroom && !prop.bathroom) return false;
            if (kitchen && !prop.kitchen) return false;
            return true;
        });
    }, [searchParams]);

    // Sync local form state with URL on change
    useEffect(() => {
        setFilters({
            province: searchParams.get("province") || "",
            district: searchParams.get("district") || "",
            propertyType: searchParams.get("propertyType") || "",
            clientType: searchParams.get("clientType") || "",
            maxPrice: searchParams.get("maxPrice") || "",
            attachedBathroom: searchParams.get("attachedBathroom") === "true",
            kitchen: searchParams.get("kitchen") === "true"
        });
    }, [searchParams]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (filters.province) params.append("province", filters.province);
        if (filters.district) params.append("district", filters.district);
        if (filters.propertyType) params.append("propertyType", filters.propertyType);
        if (filters.clientType) params.append("clientType", filters.clientType);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.attachedBathroom) params.append("attachedBathroom", "true");
        if (filters.kitchen) params.append("kitchen", "true");
        
        setSearchParams(params);
    };


    return (
        <div style={{ paddingTop: "100px", paddingBottom: "50px", background: "#f8f9fa" }}>
            <div className="bg-success py-5 mb-5 mt-n5" style={{ background: 'var(--primary-gradient) !important' }}>
                <Container className="text-center text-white">
                    <motion.h2
                        className="mt-4 fw-bold"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem' }}
                    >{t('listings.title')}</motion.h2>
                    <p className="lead opacity-90">{t('listings.subtitle')}</p>
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
                            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                                <Card.Body className="p-4">
                                    <Form onSubmit={handleApplyFilters}>
                                        {/* Facilities Only */}
                                        <div className="mb-4">
                                            <Form.Label className="fw-bold small text-uppercase text-muted">Facilities</Form.Label>
                                            <div className="mt-2">
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Attached Bathroom" 
                                                    id="attachedBathroom" 
                                                    className="mb-2 custom-checkbox"
                                                    checked={filters.attachedBathroom}
                                                    onChange={(e) => handleFilterChange("attachedBathroom", e.target.checked)}
                                                />
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Kitchen" 
                                                    id="kitchen" 
                                                    className="custom-checkbox"
                                                    checked={filters.kitchen}
                                                    onChange={(e) => handleFilterChange("kitchen", e.target.checked)}
                                                />
                                            </div>
                                        </div>

                                        <Button 
                                            variant="success" 
                                            type="submit" 
                                            className="w-100 py-3 fw-bold rounded-pill shadow-sm mt-2"
                                            style={{ background: 'var(--primary-gradient)', border: 'none' }}
                                        >
                                            APPLY FILTERS
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                    {/* Listings Grid */}
                    <Col lg={9}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <p className="mb-0 text-muted">{t('listings.showing')} <strong>{filteredProperties.length}</strong> {t('listings.results')}</p>
                            <Form.Select className="w-auto border-0 bg-white shadow-sm rounded-3">
                                <option>{t('listings.sort')}: {t('listings.newest')}</option>
                                <option value="1">{t('listings.priceLow')}</option>
                                <option value="2">{t('listings.priceHigh')}</option>
                            </Form.Select>
                        </div>

                        <Row className="g-4">
                            {filteredProperties.length > 0 ? (
                                filteredProperties.map((prop, idx) => (
                                    <Col md={6} key={prop.id}>
                                        <motion.div
                                            className="property-card h-100 rounded-4 overflow-hidden shadow-lg border-0 bg-white"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                        >
                                            <div className="property-img-wrapper position-relative" style={{ height: '220px' }}>
                                                <span className="property-tag position-absolute top-3 start-3 badge bg-success fw-bold px-3 py-2">For Rent</span>
                                                <img src={prop.img} alt="Property" className="w-100 h-100 object-fit-cover" />
                                                <span className="property-price-tag position-absolute bottom-3 end-3 badge bg-danger fw-bold px-3 py-2">Rs. {prop.price.toLocaleString()}</span>
                                            </div>
                                            <div className="card-body p-4">
                                                <h5 className="card-title fw-bold mb-2 text-dark">{prop.title}</h5>
                                                <p className="card-location text-muted small mb-3"><MapPin size={14} className="me-1" /> {prop.loc}</p>

                                                <div className="card-features d-flex gap-3 mb-4">
                                                    <span className="small text-muted"><i className="fas fa-bed me-1 text-success"></i> {prop.beds} {t('listings.beds')}</span>
                                                    <span className="small text-muted"><i className="fas fa-bath me-1 text-success"></i> {prop.share ? t('listings.shared') : prop.bath || (prop.baths + ' ' + t('listings.bath'))}</span>
                                                </div>

                                                <Link to={`/property/${prop.id}`} className="btn btn-success w-100 fw-bold rounded-pill py-2 shadow-sm" style={{ background: 'var(--primary-gradient)', border: 'none' }}>{t('listings.viewDetails')}</Link>
                                            </div>
                                        </motion.div>
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center py-5">
                                    <div className="p-5 bg-white rounded-4 shadow-sm">
                                        <h4 className="text-muted">No properties found matching your criteria</h4>
                                        <Button variant="link" className="text-success mt-3" onClick={() => {
                                            setFilters({
                                                province: "", district: "", propertyType: "", clientType: "", maxPrice: "", attachedBathroom: false, kitchen: false
                                            });
                                            setSearchParams({});
                                        }}>Clear all filters</Button>
                                    </div>
                                </Col>
                            )}
                        </Row>

                        {/* Pagination */}
                        {filteredProperties.length > 0 && (
                            <div className="mt-5 d-flex justify-content-center">
                                <ul className="pagination">
                                    <li className="page-item disabled"><a className="page-link rounded-start-pill px-3" href="#">Previous</a></li>
                                    <li className="page-item active"><a className="page-link px-3" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link px-3" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link rounded-end-pill px-3" href="#">Next</a></li>
                                </ul>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Listings;
