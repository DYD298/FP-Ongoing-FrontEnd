import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const Login = () => {
    const { t } = useLanguage();

    return (
        <div className="d-flex align-items-center min-vh-100 py-5 bg-light" style={{ paddingTop: "100px" }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <div className="text-center mb-4">
                            <Link to="/" className="text-decoration-none">
                                <h2 className="fw-bold text-success"><i className="fas fa-home me-2"></i>{t('auth.loginTitle')}</h2>
                            </Link>
                            <p className="text-muted">{t('auth.loginWelcome')}</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="shadow-lg border-0 rounded-4">
                                <Card.Body className="p-5">
                                    <Form>
                                        <div className="mb-3">
                                            <Form.Label>{t('auth.email')}</Form.Label>
                                            <Form.Control type="email" placeholder="name@example.com" />
                                        </div>

                                        <div className="mb-4">
                                            <Form.Label>{t('auth.password')}</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" />
                                        </div>

                                        <div className="d-flex justify-content-between mb-4">
                                            <Form.Check type="checkbox" label={t('auth.remember')} />
                                            <a href="#" className="text-decoration-none small">{t('auth.forgot')}</a>
                                        </div>

                                        <Button variant="success" type="submit" className="w-100 py-2 fw-bold">{t('auth.loginBtn')}</Button>
                                    </Form>

                                    <div className="text-center mt-4">
                                        <p className="text-muted">{t('auth.noAccount')} <Link to="/register" className="text-success fw-bold text-decoration-none">{t('auth.registerLink')}</Link></p>
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

export default Login;
