import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../services/axios';
import { Button, Card, Container, Form } from 'react-bootstrap';

const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    const handleRegister = async () => {
        try {
            await API.post('/auth/register', form);

            toast.success("Registration successful!");
            navigate('/');

        } catch {
            toast.error("Registration failed");
        }
    };

    return (
        <Container className="d-flex vh-100 justify-content-center align-items-center">
            <Card style={{ width: '450px' }} className="shadow">
                <Card.Body>
                    <h3 className="mb-3 text-center">Customer Registration</h3>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                placeholder="Full Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </Form.Group>

                        <h5 className="mb-2" style={{ fontSize: '14px', fontWeight: '600' }}>Address</h5>

                        <Form.Group className="mb-3">
                            <Form.Control
                                placeholder="Street Address"
                                value={form.address.street}
                                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                            />
                        </Form.Group>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="City"
                                    value={form.address.city}
                                    onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="State"
                                    value={form.address.state}
                                    onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                                />
                            </Form.Group>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="Postal Code"
                                    value={form.address.postalCode}
                                    onChange={(e) => setForm({ ...form, address: { ...form.address, postalCode: e.target.value } })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="Country"
                                    value={form.address.country}
                                    onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                                />
                            </Form.Group>
                        </div>

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