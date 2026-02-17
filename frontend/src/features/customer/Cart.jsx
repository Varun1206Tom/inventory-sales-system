import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Badge } from 'react-bootstrap';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await API.get('/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data.items || []);
        } catch (err) {
            console.error("Failed to fetch cart:", err.response?.data || err.message);
            alert("Failed to fetch cart items");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, delta) => {
        try {
            setUpdating(true);
            const updatedItems = cartItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            ).filter(item => item.quantity > 0);

            await API.put('/cart/update', {
                items: updatedItems.map(i => ({ productId: i.product._id, quantity: i.quantity }))
            }, { headers: { Authorization: `Bearer ${token}` } });

            setCartItems(updatedItems);
        } catch (err) {
            console.error("Failed to update cart:", err.response?.data || err.message);
            alert("Failed to update cart");
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (id) => {
        try {
            setUpdating(true);
            await API.delete(`cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchCart();
        } catch (err) {
            console.error("Failed to remove item:", err.response?.data || err.message);
            alert("Failed to remove item");
        } finally {
            setUpdating(false);
        }
    };

    const placeOrder = async () => {
        try {
            setUpdating(true);
            await API.post('/orders/place', {
                items: cartItems.map(i => ({ product: i.product._id, quantity: i.quantity }))
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("Order placed successfully!");
            navigate('/success');
        } catch (err) {
            console.error("Failed to place order:", err.response?.data || err.message);
            alert("Failed to place order");
        } finally {
            setUpdating(false);
        }
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (loading) return <AppNavbar />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AppNavbar />
            <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }}>
                {/* Header with Back Button and Title */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '25px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Button
                            variant="link"
                            onClick={() => navigate(-1)}
                            style={{ 
                                color: '#666',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                textDecoration: 'none'
                            }}
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Button>
                        <h3 style={{ margin: 0, fontWeight: '600', color: '#333' }}>
                            My Cart {totalItems > 0 && `(${totalItems} items)`}
                        </h3>
                    </div>
                    {cartItems.length > 0 && (
                        <Badge bg="secondary" style={{ fontSize: '14px', padding: '8px 15px' }}>
                            Total: ₹{totalAmount}
                        </Badge>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <Card className="text-center border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <Card.Body style={{ padding: '60px 40px' }}>
                            <div style={{ 
                                width: '120px', 
                                height: '120px', 
                                background: '#f1f3f5', 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px'
                            }}>
                                <ShoppingBag size={50} color="#adb5bd" />
                            </div>
                            <h4 style={{ color: '#495057', marginBottom: '15px' }}>Your cart is empty</h4>
                            <p style={{ color: '#868e96', marginBottom: '25px' }}>
                                Looks like you haven't added anything to your cart yet
                            </p>
                            <Button 
                                onClick={() => navigate('/customer/product-catalog')}
                                variant="primary"
                                size="lg"
                                style={{ 
                                    padding: '12px 30px',
                                    borderRadius: '8px'
                                }}
                            >
                                Browse Products
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <>
                        <Row>
                            <Col lg={8}>
                                {cartItems.map(item => (
                                    <Card 
                                        key={item.product._id} 
                                        className="shadow-sm mb-3 border-0"
                                        style={{ borderRadius: '12px', overflow: 'hidden' }}
                                    >
                                        <Card.Body style={{ padding: '15px' }}>
                                            <Row className="align-items-center">
                                                <Col xs={3} md={2}>
                                                    <div style={{ 
                                                        width: '100%', 
                                                        aspectRatio: '1/1',
                                                        background: '#f8f9fa', 
                                                        borderRadius: '8px',
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        border: '1px solid #e9ecef'
                                                    }}>
                                                        {item.product.image ? 
                                                            <img 
                                                                src={item.product.image} 
                                                                alt={item.product.name} 
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '100%', 
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }} 
                                                            /> 
                                                            : <ShoppingBag size={24} color="#adb5bd" />
                                                        }
                                                    </div>
                                                </Col>
                                                <Col xs={5} md={6}>
                                                    <h6 style={{ fontWeight: '600', marginBottom: '5px' }}>
                                                        {item.product.name}
                                                    </h6>
                                                    <p style={{ 
                                                        color: '#495057', 
                                                        fontWeight: '500', 
                                                        marginBottom: '5px'
                                                    }}>
                                                        ₹{item.product.price}
                                                    </p>
                                                    <p style={{ 
                                                        color: '#868e96', 
                                                        fontSize: '13px',
                                                        marginBottom: 0
                                                    }}>
                                                        Subtotal: ₹{item.product.price * item.quantity}
                                                    </p>
                                                </Col>
                                                <Col xs={4} md={4}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        gap: '8px', 
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end'
                                                    }}>
                                                        <Button 
                                                            size="sm"
                                                            variant="outline-secondary"
                                                            disabled={updating || item.quantity <= 1}
                                                            onClick={() => updateQuantity(item.product._id, -1)}
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                padding: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderRadius: '6px'
                                                            }}
                                                        >
                                                            <Minus size={16} />
                                                        </Button>
                                                        <span style={{ 
                                                            minWidth: '30px', 
                                                            textAlign: 'center',
                                                            fontWeight: '500'
                                                        }}>
                                                            {item.quantity}
                                                        </span>
                                                        <Button 
                                                            size="sm"
                                                            variant="outline-secondary"
                                                            disabled={updating}
                                                            onClick={() => updateQuantity(item.product._id, 1)}
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                padding: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderRadius: '6px'
                                                            }}
                                                        >
                                                            <Plus size={16} />
                                                        </Button>
                                                        <Button 
                                                            size="sm"
                                                            variant="outline-danger"
                                                            disabled={updating}
                                                            onClick={() => removeItem(item._id)}
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                padding: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderRadius: '6px',
                                                                marginLeft: '5px'
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Col>
                            
                            <Col lg={4}>
                                <Card className="shadow-sm border-0 sticky-top" style={{ 
                                    borderRadius: '12px',
                                    top: '20px',
                                    zIndex: 1
                                }}>
                                    <Card.Body style={{ padding: '20px' }}>
                                        <h5 style={{ 
                                            fontWeight: '600', 
                                            marginBottom: '20px',
                                            paddingBottom: '15px',
                                            borderBottom: '1px solid #e9ecef'
                                        }}>
                                            Order Summary
                                        </h5>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                marginBottom: '10px',
                                                color: '#495057'
                                            }}>
                                                <span>Subtotal ({totalItems} items)</span>
                                                <span>₹{totalAmount}</span>
                                            </div>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                marginBottom: '10px',
                                                color: '#495057'
                                            }}>
                                                <span>Shipping</span>
                                                <span className="text-success">Free</span>
                                            </div>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            marginBottom: '20px',
                                            paddingTop: '15px',
                                            borderTop: '1px solid #e9ecef',
                                            fontWeight: '600',
                                            fontSize: '18px'
                                        }}>
                                            <span>Total</span>
                                            <span>₹{totalAmount}</span>
                                        </div>
                                        
                                        <Button 
                                            variant="success"
                                            size="sm"
                                            disabled={updating || cartItems.length === 0}
                                            onClick={placeOrder}
                                            style={{ 
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px'
                                            }}
                                        >
                                            <CreditCard size={20} />
                                            {updating ? 'Placing Order...' : 'Place Order'}
                                        </Button>
                                        
                                        <Button
                                            variant="link"
                                            onClick={() => navigate('/customer/product-catalog')}
                                            style={{ 
                                                width: '100%',
                                                marginTop: '15px',
                                                color: '#666',
                                                textDecoration: 'none',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Continue Shopping
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;