import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin, Bed, Bath, Search, RefreshCcw, CameraOff } from "lucide-react";

const Listings = () => {
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Points to your FastAPI server proxy
    const API_BASE_URL = "http://localhost:8001";

    const [filters, setFilters] = useState({
        maxPrice: searchParams.get("maxPrice") || "",
        attachedBathroom: searchParams.get("attachedBathroom") === "true",
        kitchen: searchParams.get("kitchen") === "true"
    });

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Fetching only ACTIVE ads
                const response = await fetch(`${API_BASE_URL}/ads/active`);
                if (!response.ok) throw new Error("Failed to fetch listings");
                const data = await response.json();
                setProperties(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [API_BASE_URL]);

    const filteredProperties = useMemo(() => {
        const maxPrice = searchParams.get("maxPrice");
        const bathroom = searchParams.get("attachedBathroom") === "true";

        return properties.filter(prop => {
            if (maxPrice && prop.price > parseInt(maxPrice)) return false;
            if (bathroom && !prop.facilities?.includes("Attached Bathroom")) return false;
            return true;
        });
    }, [searchParams, properties]);

    /**
     * Helper to build the correct image URL targeting the FastAPI Proxy.
     * It handles cleaning the filename to match MinIO objects.
     */
    const getImageUrl = (imgName) => {
        if (!imgName || imgName === "undefined") {
            return "https://placehold.co/600x400?text=No+Image+Found";
        }

        // Clean name: removes bucket name or leading slashes if they exist in the DB string
        let cleanedName = imgName.replace("boarding-images/", "");
        cleanedName = cleanedName.startsWith("/") ? cleanedName.substring(1) : cleanedName;

        // Use encodeURIComponent to handle special characters or spaces safely
        return `${API_BASE_URL}/ads/image/${encodeURIComponent(cleanedName)}`;
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.attachedBathroom) params.append("attachedBathroom", "true");
        setSearchParams(params);
    };

    return (
        <div style={{ paddingTop: "100px", paddingBottom: "50px", background: "#f8f9fa" }}>
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card className="shadow-sm border-0 rounded-4 mb-4">
                            <Card.Body className="p-4">
                                <Form onSubmit={handleApplyFilters}>
                                    <h6 className="fw-bold mb-3"><Search size={18} className="me-2 text-success"/> Filters</h6>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold text-muted">MAX PRICE (LKR)</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                            placeholder="e.g. 25000"
                                            className="border-0 bg-light rounded-3 shadow-none"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Check 
                                            type="checkbox" 
                                            label="Attached Bathroom" 
                                            id="bathroom-check"
                                            checked={filters.attachedBathroom}
                                            onChange={(e) => setFilters({...filters, attachedBathroom: e.target.checked})}
                                        />
                                    </Form.Group>

                                    <Button variant="success" type="submit" className="w-100 rounded-pill fw-bold shadow-sm border-0 py-2">
                                        APPLY FILTERS
                                    </Button>
                                    
                                    <Button 
                                        variant="link" 
                                        className="w-100 mt-2 text-muted text-decoration-none small"
                                        onClick={() => {
                                            setSearchParams({});
                                            setFilters({ maxPrice: "", attachedBathroom: false, kitchen: false });
                                        }}
                                    >
                                        <RefreshCcw size={14} className="me-1"/> Reset All
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={9}>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="success" />
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger rounded-4 text-center">{error}</div>
                        ) : (
                            <Row className="g-4">
                                {filteredProperties.length > 0 ? (
                                    filteredProperties.map((prop, idx) => (
                                        <Col md={6} key={prop.id || idx}>
                                            <motion.div 
                                                className="h-100 rounded-4 shadow-sm bg-white overflow-hidden border-0" 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ y: -8 }}
                                            >
                                                <div style={{ height: '240px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                                                    <img 
                                                        src={getImageUrl(prop.images?.[0])} 
                                                        alt={prop.title} 
                                                        className="w-100 h-100 object-fit-cover"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
                                                        }}
                                                    />
                                                    <div className="position-absolute bottom-0 end-0 m-3 badge bg-success fs-6 shadow-sm px-3 py-2 rounded-pill">
                                                        Rs. {prop.price.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h5 className="fw-bold text-dark text-truncate mb-1">{prop.title}</h5>
                                                    <p className="text-muted small mb-3 d-flex align-items-center gap-1">
                                                        <MapPin size={14} className="text-success"/> {prop.district}
                                                    </p>
                                                    <div className="d-flex gap-4 mb-4 text-muted small border-top pt-3">
                                                        <span className="d-flex align-items-center gap-1"><Bed size={16} className="text-success"/> {prop.beds} Beds</span>
                                                        <span className="d-flex align-items-center gap-1"><Bath size={16} className="text-success"/> {prop.baths} Baths</span>
                                                    </div>
                                                    <Link to={`/property/${prop.id}`} className="btn btn-outline-success w-100 rounded-pill fw-bold py-2">
                                                        VIEW DETAILS
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        </Col>
                                    ))
                                ) : (
                                    <Col className="text-center py-5">
                                        <div className="p-5 bg-white rounded-4 shadow-sm border border-light">
                                            <CameraOff size={48} className="text-muted mb-3 opacity-25" />
                                            <h4 className="text-muted fw-bold">No active properties found</h4>
                                            <p className="text-secondary">Try adjusting your price or location filters.</p>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Listings;