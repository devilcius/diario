import React, { useState } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Routes from './routes';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from './api/auth';
import { t } from 'i18next';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    logout(() => navigate('/login'));
  }

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);  

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <Navbar expand="lg" className="app-navbar">
          <Container fluid className="app-navbar__inner">
            <Navbar.Brand as={NavLink} to="/" className="app-navbar__brand">
              Diario
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="app-navbar-nav" />
            <Navbar.Collapse id="app-navbar-nav">
              <Nav className="app-navbar__nav">
                <Nav.Link as={NavLink} to="/" end className="app-navbar__link">
                  {t('navbar.entries')}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/previous-years-entries" className="app-navbar__link">
                  {t('navbar.previous_years')}
                </Nav.Link>
              </Nav>
              <div className="app-navbar__actions">
                <Button as={NavLink} to="/entries/edit" className="app-navbar__new-button">
                  {t('navbar.new')}
                </Button>
                <Button variant="link" onClick={handleLogout} className="app-navbar__logout">
                  {t('navbar.logout')}
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      <Container fluid="lg" className="app-content">
        <Routes isAuthenticated={isAuthenticated} />
      </Container>
    </div>
  );
};

export default App;
