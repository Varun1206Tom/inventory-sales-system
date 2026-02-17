import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../../services/axios';
import { Button, Card, Container, Form } from 'react-bootstrap';

const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleRegister = async () => {
        try {
            await API.post('/auth/register', form);

            alert("Registration Successful");
            navigate('/');

        } catch {
            alert("Registration Failed");
        }
    };

    return (
        <Container className="d-flex vh-100 justify-content-center align-items-center">
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <h3 className="mb-3 text-center">Customer Registration</h3>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                placeholder="Full Name"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                placeholder="Email"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </Form.Group>

                        <Button variant="success" className="w-100 mb-2" onClick={handleRegister}>
                            Register
                        </Button>

                        <Button variant="outline-secondary" className="w-100"
                            onClick={() => navigate('/')}>
                            Back to Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Register