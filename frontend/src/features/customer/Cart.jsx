import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Badge } from 'react-bootstrap';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { CartItemSkeleton } from '../../components/Skeleton';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const handleLoginRedirect = () => {
        navigate('/login', { state: { from: '/cart' } });
    };

    const styles = {
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
        },
        modalContent: {
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '360px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        },
        modalIcon: {
            textAlign: 'center',
            marginBottom: '16px',
            fontSize: '48px',
        },
        modalTitle: {
            marginBottom: '8px',
            color: '#2d3748',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 700
        },
        modalText: {
            color: '#718096',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '14px',
        },
        modalButtons: {
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
        },
        primaryButton: {
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            flex: 1,
        },
        secondaryButton: {
            padding: '10px 20px',
            background: '#f7fafc',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1,
        },
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
        },
        loadingText: {
            color: 'white',
            fontSize: '14px',
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.7
        },
        emptyTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#2d3748',
            marginBottom: '8px'
        },
        emptyDesc: {
            fontSize: '14px',
            color: '#718096',
            marginBottom: '16px'
        },
        clearFiltersBtn: {
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
        }
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            
            // Guest user: load from localStorage
            if (!token) {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsed = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsed) ? parsed : []);
                } else {
                    setCartItems([]);
                }
                setLoading(false);
                return;
            }

            // Logged-in user: fetch from API
            const res = await API.get('/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data.items || []);
        } catch (err) {
            // If API fails and user is guest, try localStorage as fallback
            if (!token) {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsed = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsed) ? parsed : []);
                } else {
                    setCartItems([]);
                }
            } else {
                console.error("Failed to fetch cart:", err.response?.data || err.message);
                toast.error("Failed to fetch cart items");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, delta) => {
        const item = cartItems.find(i => i.product?._id === productId || i.product === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        // Guest user: update localStorage
        if (!token) {
            try {
                setUpdating(true);
                const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                let updatedCart;

                if (newQuantity <= 0) {
                    updatedCart = currentCart.filter(i => 
                        (i.product?._id || i.product) !== productId
                    );
                } else {
                    updatedCart = currentCart.map(i => {
                        const itemId = i.product?._id || i.product;
                        if (itemId === productId) {
                            return { ...i, quantity: newQuantity };
                        }
                        return i;
                    });
                }

                setCartItems(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            } catch (err) {
                console.error("Failed to update cart:", err);
                toast.error("Failed to update cart");
            } finally {
                setUpdating(false);
            }
            return;
        }

        // Logged-in user: call API
        try {
            setUpdating(true);
            const response = await API.put('/cart/update', {
                productId,
                quantity: newQuantity
            });

            // Update local state based on response
            if (newQuantity <= 0) {
                setCartItems(cartItems.filter(i => (i.product?._id || i.product) !== productId));
            } else {
                setCartItems(cartItems.map(i => {
                    const itemId = i.product?._id || i.product;
                    return itemId === productId
                        ? { ...i, quantity: newQuantity }
                        : i;
                }));
            }
        } catch (err) {
            console.error("Failed to update cart:", err.response?.data || err.message);
            toast.error("Failed to update cart");
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (id) => {
        // Guest user: remove from localStorage
        if (!token) {
            try {
                setUpdating(true);
                const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const updatedCart = currentCart.filter((item, index) => {
                    // Match by index or by product ID
                    const itemId = item.product?._id || item.product;
                    return index !== id && itemId !== id;
                });
                setCartItems(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            } catch (err) {
                console.error("Failed to remove item:", err);
                toast.error("Failed to remove item");
            } finally {
                setUpdating(false);
            }
            return;
        }

        // Logged-in user: call API
        try {
            setUpdating(true);
            await API.delete(`cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchCart();
        } catch (err) {
            console.error("Failed to remove item:", err.response?.data || err.message);
            toast.error("Failed to remove item");
        } finally {
            setUpdating(false);
        }
    };

    const placeOrder = async () => {
        if (!token) {
            // Guest user - show login popup (handled by frontend popup you added)
            setShowLoginPopup(true);
            return;
        }
        try {
            setUpdating(true);
            // Extract product ID - handle both formats (full object or populated object)
            const items = cartItems.map(i => ({
                product: i.product?._id || i.product,
                quantity: i.quantity
            })).filter(i => i.product); // Filter out invalid items

            if (items.length === 0) {
                toast.error("Cart is empty");
                setUpdating(false);
                return;
            }

            await API.post('/orders/place', {
                items
            }, { headers: { Authorization: `Bearer ${token}` } });

            setCartItems([]);
            localStorage.removeItem('cart'); // Clear cart from localStorage
            toast.success("Order placed successfully!");
            navigate('/success');
        } catch (err) {
            console.error("Failed to place order:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Failed to place order");
        } finally {
            setUpdating(false);
        }
    };

    const totalAmount = cartItems.reduce((acc, item) => {
        const price = item.product?.price || 0;
        const qty = item.quantity || 0;
        return acc + (price * qty);
    }, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <AppNavbar />
                <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }}>
                    <div className="bg-white rounded-3 shadow-sm p-3">
                        {[1, 2, 3].map((i) => (
                            <CartItemSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#eef7ff' }}>
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
                                size="sm"
                                className='fw-semibold'
                                style={{ 
                                    padding: '8px 25px',
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
                                {cartItems.map((item, index) => {
                                    const productId = item.product?._id || item.product;
                                    const productName = item.product?.name || 'Unknown Product';
                                    const productPrice = item.product?.price || 0;
                                    const productImage = item.product?.image;
                                    return (
                                    <Card 
                                        key={productId || index} 
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
                                                        {productImage ? 
                                                            <img 
                                                                src={`http://localhost:5000/uploads/${productImage}`} 
                                                                alt={productName} 
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
                                                        {productName}
                                                    </h6>
                                                    <p style={{ 
                                                        color: '#495057', 
                                                        fontWeight: '500', 
                                                        marginBottom: '5px'
                                                    }}>
                                                        ₹{productPrice}
                                                    </p>
                                                    <p style={{ 
                                                        color: '#868e96', 
                                                        fontSize: '13px',
                                                        marginBottom: 0
                                                    }}>
                                                        Subtotal: ₹{productPrice * item.quantity}
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
                                                            onClick={() => updateQuantity(productId, -1)}
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
                                                            onClick={() => updateQuantity(productId, 1)}
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
                                                            onClick={() => removeItem(item._id || productId || index)}
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
                                    );
                                })}
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

                {/* Login Popup Modal */}
                {showLoginPopup && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalIcon}>🔐</div>
                            <h3 style={styles.modalTitle}>Login Required</h3>
                            <p style={styles.modalText}>
                                Please login to continue
                            </p>
                            <div style={styles.modalButtons}>
                                <button
                                    style={styles.primaryButton}
                                    onClick={handleLoginRedirect}
                                >
                                    Login
                                </button>
                                <button
                                    style={styles.secondaryButton}
                                    onClick={() => {
                                        setShowLoginPopup(false);
                                        setPendingProduct(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;