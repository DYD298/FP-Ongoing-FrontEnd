import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer" id="contact">
            <Container>
                <Row>
                    <Col lg={4} className="mb-4">
                        <h5 className="text-white mb-3">CEYLON STAY</h5>
                        <p className="small">{t('footer.desc')}</p>
                        <div className="social-links mt-4">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </Col>
                    <Col lg={2} md={6} className="mb-4">
                        <h5>{t('footer.quickLinks')}</h5>
                        <Link to="/" className="footer-link">{t('nav.home')}</Link>
                        <Link to="/listings" className="footer-link">{t('nav.properties')}</Link>
                        <a href="#about" className="footer-link">{t('nav.about')}</a>
                    </Col>
                    <Col lg={2} md={6} className="mb-4">
                        <h5>{t('footer.support')}</h5>
                        <a href="#" className="footer-link">{t('footer.help')}</a>
                        <a href="#" className="footer-link">{t('footer.terms')}</a>
                        <a href="#" className="footer-link">{t('footer.privacy')}</a>
                        <a href="#" className="footer-link">{t('footer.faqs')}</a>
                    </Col>
                    <Col lg={4} className="mb-4">
                        <h5>{t('footer.contact')}</h5>
                        <p className="small mb-2"><i className="fas fa-map-marker-alt me-2 text-primary"></i> 123, Main Street, Colombo 03, Sri Lanka</p>
                        <p className="small mb-2"><i className="fas fa-phone me-2 text-primary"></i> +94 11 234 5678</p>
                        <p className="small mb-2"><i className="fas fa-envelope me-2 text-primary"></i> info@ceylonstay.lk</p>

                        <div className="mt-4">
                            <h6 className="text-white small fw-bold mb-2">{t('footer.subscribe')}</h6>
                            <div className="input-group">
                                <input type="email" className="form-control form-control-sm rounded-0 bg-dark border-secondary text-light" placeholder={t('footer.emailPlace')} />
                                <button className="btn btn-primary btn-sm rounded-0" type="button"><i className="fas fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="copyright">
                    <p className="mb-0">&copy; {t('footer.copyright')}</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
