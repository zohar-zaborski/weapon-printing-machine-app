import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import authService from '../services/auth.service';
import AppNavbar from '../components/AppNavbar';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(username, password);
      window.location.href = '/home'; // Redirect to home on successful login
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="pt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <p>
                    Don't have an account? <Link to="/register">Register here</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
