import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package, Home } from 'lucide-react';
import AppNavbar from '../../components/AppNavbar';

const SuccessScreen = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AppNavbar />
            <div style={{ 
                maxWidth: '500px', 
                margin: '30px auto', 
                padding: '0 15px',
                textAlign: 'center'
            }}>
                <Card className="shadow border-0">
                    <Card.Body style={{ padding: '25px 20px' }}>
                        <div style={{ 
                            color: '#28a745', 
                            marginBottom: '15px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <CheckCircle size={50} strokeWidth={1.5} />
                        </div>
                        
                        <h4 style={{ 
                            color: '#333', 
                            marginBottom: '10px',
                            fontWeight: '600'
                        }}>
                            Order Placed Successfully!
                        </h4>
                        
                        <p style={{ 
                            color: '#666', 
                            fontSize: '14px',
                            marginBottom: '20px',
                            lineHeight: '1.5'
                        }}>
                            Thank you for your order! We'll send you a confirmation email with 
                            order details and tracking information once your order ships.
                        </p>

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => navigate('/customer/product-catalog')}
                                style={{ 
                                    padding: '8px 16px',
                                    minWidth: '160px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <ShoppingBag size={16} />
                                Browse More
                            </Button>
                            
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => navigate('/customer/orders')}
                                style={{ 
                                    padding: '8px 16px',
                                    minWidth: '160px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <Package size={16} />
                                My Orders
                            </Button>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <Button 
                                variant="link" 
                                onClick={() => navigate('/')}
                                style={{ 
                                    color: '#666',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    textDecoration: 'none',
                                    fontSize: '13px',
                                    padding: '5px'
                                }}
                            >
                                <Home size={14} />
                                Back to Home
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default SuccessScreen;