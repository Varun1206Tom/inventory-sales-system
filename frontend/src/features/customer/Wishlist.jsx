import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spinner, Badge, Button } from 'react-bootstrap';
import {
    Heart,
    ShoppingCart,
    Trash2,
    ArrowLeft,
    Package,
    Eye,
    XCircle
} from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await API.get('/wishlist');
            // Extract products from wishlist items
            const products = res.data.products?.map(item => item.product) || [];
            setWishlistItems(products);
        } catch (err) {
            console.error('Failed to fetch wishlist:', err.response?.data || err.message);
            if (err.response?.status !== 401) {
                toast.error('Failed to load wishlist');
            }
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            setRemoving({ ...removing, [productId]: true });
            await API.delete(`/wishlist/remove/${productId}`);
            setWishlistItems(wishlistItems.filter(item => item._id !== productId));
            toast.success('Removed from wishlist');
        } catch (err) {
            console.error('Failed to remove from wishlist:', err.response?.data || err.message);
            toast.error('Failed to remove from wishlist');
        } finally {
            setRemoving({ ...removing, [productId]: false });
        }
    };

    const addToCart = async (product) => {
        try {
            await API.post('/cart/add', { productId: product._id, quantity: 1 });
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: '#c53030', bg: '#fff5f5' };
        if (stock < 10) return { text: 'Low Stock', color: '#c05621', bg: '#fffaf0' };
        return { text: 'In Stock', color: '#276749', bg: '#f0fff4' };
    };

    const calculateDiscount = (price, mrp) => {
        if (!mrp || mrp <= price) return null;
        return Math.round(((mrp - price) / mrp) * 100);
    };

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <AppNavbar />
                <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                    <Card className="text-center border-0 shadow-sm">
                        <Card.Body style={{ padding: '60px 40px' }}>
                            <Heart size={60} color="#adb5bd" style={{ marginBottom: '20px' }} />
                            <h4>Please Login</h4>
                            <p className="text-muted mb-4">You need to be logged in to view your wishlist</p>
                            <Button variant="primary" onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <AppNavbar />
                <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Button variant="link" onClick={() => navigate(-1)} style={{ padding: 0 }}>
                            <ArrowLeft size={20} />
                        </Button>
                        <h4 className="mb-0">My Wishlist</h4>
                    </div>
                    <Row>
                        {[1, 2, 3, 4].map((i) => (
                            <Col key={i} md={3} sm={6} className="mb-4">
                                <ProductCardSkeleton />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AppNavbar />
            <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="link"
                            onClick={() => navigate(-1)}
                            style={{ padding: 0, color: '#666' }}
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <h4 className="mb-0">My Wishlist</h4>
                            <p className="text-muted mb-0 small">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                    </div>
                    {wishlistItems.length > 0 && (
                        <Button variant="outline-primary" onClick={() => navigate('/')}>
                            Continue Shopping
                        </Button>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <Card className="text-center border-0 shadow-sm">
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
                                <Heart size={50} color="#adb5bd" />
                            </div>
                            <h4 style={{ color: '#495057', marginBottom: '15px' }}>Your wishlist is empty</h4>
                            <p style={{ color: '#868e96', marginBottom: '25px' }}>
                                Start adding products you love to your wishlist
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/')}
                                className="fw-semibold"
                            >
                                Browse Products
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <Row>
                        {wishlistItems.map((product) => {
                            const stockStatus = getStockStatus(product.stock);
                            const discount = calculateDiscount(product.price, product.mrp);
                            const imageUrl = product.image
                                ? `http://localhost:5000/uploads/${product.image}`
                                : null;

                            return (
                                <Col key={product._id} md={3} sm={6} className="mb-4">
                                    <Card
                                        className="h-100 border-0 shadow-sm"
                                        style={{
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1/1',
                                                background: '#f8f9fa',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-center h-100">
                                                    <Package size={40} color="#adb5bd" />
                                                </div>
                                            )}
                                            {/* Remove from wishlist button */}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    borderRadius: '50%',
                                                    width: '32px',
                                                    height: '32px',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    zIndex: 10
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromWishlist(product._id);
                                                }}
                                                disabled={removing[product._id]}
                                            >
                                                {removing[product._id] ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </Button>
                                            {/* Stock Badge */}
                                            <Badge
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    backgroundColor: stockStatus.bg,
                                                    color: stockStatus.color,
                                                    fontSize: '10px',
                                                    padding: '4px 8px'
                                                }}
                                            >
                                                {stockStatus.text}
                                            </Badge>
                                            {/* Discount Badge */}
                                            {discount != null && (
                                                <Badge
                                                    bg="success"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '8px',
                                                        right: '8px',
                                                        fontSize: '11px',
                                                        padding: '4px 8px'
                                                    }}
                                                >
                                                    {discount}% OFF
                                                </Badge>
                                            )}
                                        </div>

                                        <Card.Body style={{ padding: '15px' }}>
                                            {/* Product Name */}
                                            <h6
                                                style={{
                                                    fontWeight: '600',
                                                    marginBottom: '8px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                title={product.name}
                                            >
                                                {product.name}
                                            </h6>

                                            {/* Price */}
                                            <div className="d-flex align-items-baseline gap-2 mb-3">
                                                <span style={{ fontSize: '16px', fontWeight: '600', color: '#28a745' }}>
                                                    ₹{product.price}
                                                </span>
                                                {discount != null && (
                                                    <>
                                                        <span
                                                            className="text-muted text-decoration-line-through"
                                                            style={{ fontSize: '12px' }}
                                                        >
                                                            ₹{product.mrp}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="flex-fill"
                                                    onClick={() => navigate(`/product/${product._id}`)}
                                                >
                                                    <Eye size={14} className="me-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="flex-fill"
                                                    onClick={() => addToCart(product)}
                                                    disabled={product.stock === 0}
                                                >
                                                    <ShoppingCart size={14} className="me-1" />
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
