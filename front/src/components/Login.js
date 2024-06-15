import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { login } from '../api/auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginResponse = await login(username, password);
            if (loginResponse) {
                history('/');
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
        }
    };

    return (
        <Container>
            <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    );
};

export default Login;