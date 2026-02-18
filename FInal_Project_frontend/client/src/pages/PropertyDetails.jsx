import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Card, Button, Spinner, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, Sofa, CheckCircle, Phone, Mail, ShieldAlert, Clock, ImageOff, Send, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Toast from '../components/Toast';
import { Modal, Form } from 'react-bootstrap';

const PropertyDetails = () => {
    const { id } = useParams();
    const { t } = useLanguage();
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Configuration - Pointing to your FastAPI Proxy
    const API_BASE_URL = "http://localhost:8001";

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                // 1. Fetch main property data
                const response = await fetch(`${API_BASE_URL}/ads/${id}`);
                
                if (!response.ok) throw new Error("Property not found");
                
                const data = await response.json();
                
                // 2. Map image names to the Backend Proxy URL
                // This matches your @app.get("/ads/image/{image_name}") endpoint
                const proxyImages = data.images.map(imgName => {
                    const cleanedName = imgName.startsWith('/') ? imgName.substring(1) : imgName;
                    return `${API_BASE_URL}/ads/image/${cleanedName}`;
                });

                setProperty({
                    ...data,
                    displayImages: proxyImages,
                    // Simple logic to extract a display name from email
                    owner: { 
                        name: data.owner_email ? data.owner_email.split('@')[0] : "Owner", 
                        since: "2024",
                        phone: data.phone || "077 123 4567", // Fallback for demo
                        email: data.owner_email 
                    } 
                });
            } catch (err) {
                console.error("Failed to fetch property:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, API_BASE_URL]);

    if (loading) return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="success" />
        </div>
    );

    if (error || !property) return (
        <Container className="py-5 mt-5 text-center">
            <ImageOff size={64} className="text-muted mb-3 opacity-25" />
            <h2 className="text-muted">Property not found or is pending verification.</h2>
            <Link to="/listings" className="btn btn-success mt-3 rounded-pill px-4">Back to Search</Link>
        </Container>
    );

    return (
        <div style={{ paddingTop: "100px", paddingBottom: "50px", background: "#fdfdfd" }}>
            <Toast 
                show={showToast} 
                onClose={() => setShowToast(false)} 
                title="Message Sent" 
                message="Your message has been sent to the property owner's email." 
            />
            <Container>
                {/* Status Badge */}
                {property.status === "PENDING" && (
                    <Badge bg="warning" className="mb-3 p-2 d-flex align-items-center gap-2 w-fit text-dark shadow-sm">
                        <Clock size={16} /> {t('property.pendingVerification') || 'Under AI Review'}
                    </Badge>
                )}

                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-success">{t('property.breadcrumb.home') || 'Home'}</Link></li>
                        <li className="breadcrumb-item"><Link to="/listings" className="text-decoration-none text-success">{t('property.breadcrumb.find') || 'Find'}</Link></li>
                        <li className="breadcrumb-item active text-truncate" style={{maxWidth: '250px'}}>{property.title}</li>
                    </ol>
                </nav>

                <Row>
                    <Col lg={8}>
                        {/* Image Gallery using Backend Proxy */}
                        <motion.div className="mb-4 rounded-4 overflow-hidden shadow-sm bg-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Carousel indicators={property.displayImages.length > 1} interval={5000} pause="hover">
                                {property.displayImages.map((imgUrl, index) => (
                                    <Carousel.Item key={index}>
                                        <img 
                                            className="d-block w-100" 
                                            src={imgUrl} 
                                            alt={`Property view ${index + 1}`} 
                                            style={{ height: "500px", objectFit: "cover" }} 
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = "https://placehold.co/800x500?text=Image+Unavailable"; 
                                            }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </motion.div>

                        {/* Title & Price Section */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
                            <div>
                                <h1 className="fw-bold text-dark h2 mb-2">{property.title}</h1>
                                <p className="text-muted d-flex align-items-center gap-2 mb-0">
                                    <MapPin size={18} className="text-success" /> {property.address}, {property.district}
                                </p>
                            </div>
                            <div className="text-md-end mt-3 mt-md-0">
                                <h2 className="text-success fw-bold mb-0">Rs. {property.price.toLocaleString()}</h2>
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mt-1">
                                    {t('property.perMonth') || '/ Month'}
                                </span>
                            </div>
                        </div>

                        <hr className="my-4 opacity-25" />

                        {/* Property Specs Grid */}
                        <Row className="g-3 mb-5">
                            {[
                                { icon: <Bed />, label: `${property.beds} ${t('property.beds') || 'Beds'}` },
                                { icon: <Bath />, label: `${property.baths} ${t('property.baths') || 'Baths'}` },
                                { icon: <Maximize />, label: property.type || 'Single Room' },
                                { icon: <Sofa />, label: property.facilities?.includes("Furnished") ? "Furnished" : "Not Furnished" }
                            ].map((feat, idx) => (
                                <Col xs={6} md={3} key={idx}>
                                    <div className="p-3 bg-white rounded-4 text-center border shadow-sm h-100">
                                        <div className="text-success mb-2 d-flex justify-content-center">{feat.icon}</div>
                                        <p className="mb-0 fw-bold small text-dark">{feat.label}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        {/* Description */}
                        <h4 className="fw-bold mb-3">{t('property.description') || 'Description'}</h4>
                        <p className="text-muted lh-lg mb-5" style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
                            {property.description}
                        </p>

                        {/* Facilities List */}
                        <h4 className="fw-bold mb-3">{t('property.facilities') || 'Facilities'}</h4>
                        <Row className="mb-5 g-3">
                            {property.facilities?.map((fac, idx) => (
                                <Col md={6} key={idx}>
                                    <div className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-light">
                                        <CheckCircle size={20} className="text-success flex-shrink-0" />
                                        <span className="text-secondary fw-medium">{fac}</span>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Right Sidebar: Contact & Safety */}
                    <Col lg={4}>
                        <div style={{ position: 'sticky', top: '120px' }}>
                            <Card className="shadow-lg border-0 rounded-4 mb-4 overflow-hidden">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-4">{t('property.contactOwner') || 'Contact Owner'}</h5>
                                    <div className="d-flex align-items-center mb-4">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${property.owner.name}&background=198754&color=fff&bold=true`} 
                                            className="rounded-circle me-3 border shadow-sm" 
                                            width="64" 
                                            alt="Owner Avatar" 
                                        />
                                        <div>
                                            <h6 className="mb-0 fw-bold fs-5">{property.owner.name}</h6>
                                            <small className="text-muted">{t('property.memberSince') || 'Member since'} {property.owner.since}</small>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-3">
                                        <Button 
                                            variant={showPhone ? "light" : "success"} 
                                            onClick={() => setShowPhone(!showPhone)}
                                            className={`py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill border-0 shadow-sm transition-hover ${showPhone ? 'bg-light text-dark' : ''}`}
                                        >
                                            <Phone size={18} /> {showPhone ? property.owner.phone : (t('property.showPhone') || 'SHOW PHONE NUMBER')}
                                        </Button>
                                        <Button 
                                            variant="outline-success" 
                                            onClick={() => setShowMessageModal(true)}
                                            className="py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill"
                                        >
                                            <Mail size={18} /> {t('property.sendMessage') || 'SEND MESSAGE'}
                                        </Button>
                                    </div>

                                    {/* Safety Tips Section */}
                                    <div className="mt-4 p-3 bg-light rounded-4 border-start border-success border-4 shadow-sm">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <ShieldAlert size={18} className="text-success" />
                                            <h6 className="mb-0 fw-bold small text-uppercase tracking-wider">{t('property.safety') || 'Safety Tips'}</h6>
                                        </div>
                                        <ul className="text-muted ps-3 mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                            <li>Never send money via bank transfer before seeing the place.</li>
                                            <li>Inspect the property and verify documents in person.</li>
                                            <li>Always meet in a safe, public environment.</li>
                                        </ul>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Message Owner Modal */}
            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered className="rounded-4">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Send Message to {property.owner.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        setIsSending(true);
                        // Simulate API call
                        setTimeout(() => {
                            setIsSending(false);
                            setShowMessageModal(false);
                            setMessageText("");
                            setShowToast(true);
                            // Open mailto as a fallback to actually "send" to email
                            window.location.href = `mailto:${property.owner.email}?subject=Inquiry for ${property.title}&body=${messageText}`;
                        }, 1000);
                    }}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Your Message</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={5} 
                                required
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="I'm interested in this property. Is it still available?"
                                className="bg-light border-0 p-3 rounded-3"
                            />
                        </Form.Group>
                        <Button 
                            variant="success" 
                            type="submit" 
                            disabled={isSending}
                            className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                        >
                            {isSending ? <Spinner size="sm" /> : <Send size={18} />}
                            {isSending ? "Sending..." : "Send via Email"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PropertyDetails;