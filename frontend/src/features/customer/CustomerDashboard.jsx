import React from 'react'
import AppNavbar from '../../components/AppNavbar'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CustomerDashboard = () => {

    const navigate = useNavigate();

    return (
        <div>
            <AppNavbar />

            <Container className="mt-4">
                <h3>Customer Dashboard</h3>

                <Row className="mt-3">
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5>Browse Products</h5>
                                <p>View Stock Availability</p>
                                <Button variant="primary" onClick={() => navigate('/customer/product-catalog')}>View Catalog</Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5>Cart</h5>
                                <p>Manage Orders</p>
                                <Button variant="primary" onClick={() => navigate('/customer/cart')}>View Catalog</Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5>My Orders</h5>
                                <p>Track Status</p>
                                <Button variant="primary" onClick={() => navigate('/customer/order-history')}>View Catalog</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default CustomerDashboard