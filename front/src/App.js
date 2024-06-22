import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Routes from './routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <Container>
      {isAuthenticated && (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Diario</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">{t('navbar.entries')}</Nav.Link>
            <Nav.Link href="/entries/edit">{t('navbar.new')}</Nav.Link>
            <Nav.Link href="/previous-years-entries">{t('navbar.previous_years')}</Nav.Link>
            <Nav.Link onClick={handleLogout}>{t('navbar.logout')}</Nav.Link>
          </Nav>
        </Navbar>
      )}
      <Routes isAuthenticated={isAuthenticated} />
    </Container>
  );
};

export default App;