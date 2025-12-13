import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const Register = () => {
    const [role, setRole] = useState("user");
    const { t } = useLanguage();

    return (
        <div className="d-flex align-items-center min-vh-100 py-5 bg-light" style={{ paddingTop: "100px" }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="text-center mb-4">
                            <Link to="/" className="text-decoration-none">
                                <h2 className="fw-bold text-success"><i className="fas fa-home me-2"></i>{t('auth.registerTitle')}</h2>
                            </Link>
                            <p className="text-muted">{t('auth.registerSubtitle')}</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="shadow-lg border-0 rounded-4">
                                <Card.Body className="p-5">
                                    <Form>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Label>{t('auth.firstName')}</Form.Label>
                                                <Form.Control type="text" placeholder="John" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Label>{t('auth.lastName')}</Form.Label>
                                                <Form.Control type="text" placeholder="Doe" />
                                            </Col>
                                        </Row>

                                        <div className="mb-3">
                                            <Form.Label>{t('auth.email')}</Form.Label>
                                            <Form.Control type="email" placeholder="name@example.com" />
                                        </div>

                                        <div className="mb-3">
                                            <Form.Label>{t('auth.password')}</Form.Label>
                                            <Form.Control type="password" placeholder="Create a password" />
                                        </div>

                                        <div className="mb-4">
                                            <Form.Label>{t('auth.roleLabel')}</Form.Label>
                                            <Row className="g-3">
                                                <Col xs={6}>
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="role"
                                                        id="roleUser"
                                                        checked={role === "user"}
                                                        onChange={() => setRole("user")}
                                                    />
                                                    <label
                                                        className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                                                        htmlFor="roleUser"
                                                    >
                                                        <i className="fas fa-user mb-2"></i> {t('auth.tenant')}
                                                    </label>
                                                </Col>
                                                <Col xs={6}>
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="role"
                                                        id="roleOwner"
                                                        checked={role === "owner"}
                                                        onChange={() => setRole("owner")}
                                                    />
                                                    <label
                                                        className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                                                        htmlFor="roleOwner"
                                                    >
                                                        <i className="fas fa-house-user mb-2"></i> {t('auth.owner')}
                                                    </label>
                                                </Col>
                                            </Row>
                                        </div>

                                        <Form.Check className="mb-4">
                                            <Form.Check.Input type="checkbox" id="terms" />
                                            <Form.Check.Label className="small text-muted" htmlFor="terms">
                                                {t('auth.terms')}
                                            </Form.Check.Label>
                                        </Form.Check>

                                        <Button variant="success" type="submit" className="w-100 py-2 fw-bold">{t('auth.createAccount')}</Button>
                                    </Form>

                                    <div className="text-center mt-4">
                                        <p className="text-muted">{t('auth.haveAccount')} <Link to="/login" className="text-success fw-bold text-decoration-none">{t('auth.loginLink')}</Link></p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
