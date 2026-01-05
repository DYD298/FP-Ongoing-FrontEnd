import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const Navigation = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { language, changeLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            {/* Top Bar */}
            <div className="top-bar d-none d-lg-block">
                <Container>
                    <div className="top-bar-container">
                        <div className="top-bar-left">
                            <a href="tel:+94714959596"><i className="fas fa-phone-alt"></i>+94 714 95 95 96</a>
                            <a href="mailto:info@ceylonstay.lk"><i className="fas fa-envelope"></i>info@ceylonstay.lk</a>
                        </div>
                        <div className="top-bar-right social-links">
                            {/* Language Switcher (Desktop) */}
                            <Dropdown className="me-2">
                                <Dropdown.Toggle variant="link" id="dropdown-basic" className="p-0 text-decoration-none text-uppercase" style={{ color: 'inherit', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    {language}
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
                                    <Dropdown.Item onClick={() => changeLanguage('si')}>Sinhala</Dropdown.Item>
                                    <Dropdown.Item onClick={() => changeLanguage('ta')}>Tamil</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Theme Toggle Button (Desktop) */}
                            <Button
                                variant="link"
                                className="p-0 text-decoration-none me-2"
                                onClick={toggleTheme}
                                style={{ color: 'inherit' }}
                                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                            >
                                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                            </Button>

                            <div className="d-flex gap-2">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-twitter"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Navbar */}
            <Navbar expand="lg" fixed="top" variant={theme} className={scrolled ? "shadow-sm" : ""} style={{ top: scrolled ? 0 : "36px", transition: "all 0.3s" }}>
                <Container>
                    <Navbar.Brand as={Link} to="/">CEYLON STAY</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>{t('nav.home')}</Nav.Link>
                            <Nav.Link as={Link} to="/listings" active={location.pathname === '/listings'}>{t('nav.properties')}</Nav.Link>
                            <Nav.Link as={Link} to="/#about">{t('nav.about')}</Nav.Link>
                            <Nav.Link as={Link} to="/#contact">{t('nav.contact')}</Nav.Link>

                            {/* Mobile Language Switcher */}
                            <Nav.Link className="d-lg-none">
                                <span className="me-2" onClick={() => changeLanguage('en')} style={{ fontWeight: language === 'en' ? 'bold' : 'normal', cursor: 'pointer' }}>EN</span>|
                                <span className="mx-2" onClick={() => changeLanguage('si')} style={{ fontWeight: language === 'si' ? 'bold' : 'normal', cursor: 'pointer' }}>SI</span>|
                                <span className="ms-2" onClick={() => changeLanguage('ta')} style={{ fontWeight: language === 'ta' ? 'bold' : 'normal', cursor: 'pointer' }}>TA</span>
                            </Nav.Link>

                            {/* Theme Toggle Button (Mobile) */}
                            <Nav.Link onClick={toggleTheme} className="d-lg-none">
                                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} me-2`}></i>
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </Nav.Link>

                            <Nav.Link as={Link} to="/register" className="btn btn-success btn-sm text-white ms-3 px-3 rounded-0">{t('nav.postAd')}</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;
