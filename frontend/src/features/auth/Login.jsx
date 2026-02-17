import React, { useState } from 'react';
import { Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../services/axios';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email & password");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post('/auth/login', {
                email: email.trim(),
                password: password.trim()
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            const role = res.data.user.role;

            if (role === 'admin') navigate('/admin');
            else if (role === 'staff') navigate('/staff');
            else navigate('/customer');

        } catch (err) {
            alert(err.response?.data?.message || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex vh-100 justify-content-center align-items-center">
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <h3 className="mb-3 text-center">Login</h3>

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="w-100"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </Form>

                    {/* ✅ Registration Option */}
                    <div className="text-center mt-3">
                        <small className="text-muted">
                            New Customer?{" "}
                            <span
                                style={{ cursor: "pointer" }}
                                className="text-primary fw-semibold"
                                onClick={() => navigate('/register')}
                            >
                                Register Here
                            </span>
                        </small>
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;