import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Spinner } from 'react-bootstrap';
import { ArrowLeft, ShoppingCart, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    toast.error('Product not found');
                    navigate('/');
                } else {
                    toast.error('Failed to load product');
                }
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id, navigate]);

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: '#c53030', bg: '#fff5f5', icon: <XCircle size={16} /> };
        if (stock < 10) return { text: 'Low Stock', color: '#c05621', bg: '#fffaf0', icon: <AlertCircle size={16} /> };
        return { text: 'In Stock', color: '#276749', bg: '#f0fff4', icon: <CheckCircle size={16} /> };
    };

    const calculateDiscount = (price, mrp) => {
        if (!mrp || mrp <= price) return null;
        return Math.round(((mrp - price) / mrp) * 100);
    };

    const addToCart = async () => {
        // Guest user: add to localStorage cart (no API call)
        if (!token) {
            try {
                setAdding(true);
                const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingItemIndex = currentCart.findIndex(
                    item => (item.product?._id || item.product) === product._id
                );

                let updatedCart;
                if (existingItemIndex >= 0) {
                    updatedCart = [...currentCart];
                    updatedCart[existingItemIndex].quantity += 1;
                } else {
                    updatedCart = [...currentCart, { product: product, quantity: 1 }];
                }

                localStorage.setItem('cart', JSON.stringify(updatedCart));
                toast.success(`${product.name} added to cart!`);
            } catch (err) {
                console.error("Failed to add to cart:", err);
                toast.error('Failed to add item to cart');
            } finally {
                setAdding(false);
            }
            return;
        }

        // Logged-in user: call API
        try {
            setAdding(true);
            await API.post('/cart/add', { productId: product._id, quantity: 1 });
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <AppNavbar />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="border" />
                </div>
            </div>
        );
    }

    if (!product) return null;

    const stockStatus = getStockStatus(product.stock);
    const discount = calculateDiscount(product.price, product.mrp);
    const imageUrl = product.image ? `http://localhost:5000/uploads/${product.image}` : null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AppNavbar />
            <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 20px' }}>
                <Button
                    variant="link"
                    className="p-0 mb-3 text-secondary text-decoration-none d-flex align-items-center gap-1"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} /> Back
                </Button>
                <Card className="border-0 shadow-sm overflow-hidden">
                    <div className="row g-0">
                        <div className="col-md-5 bg-light d-flex align-items-center justify-content-center p-4" style={{ minHeight: '320px' }}>
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center text-muted bg-white rounded"
                                    style={{ width: '100%', height: '280px', border: '1px dashed #dee2e6' }}
                                >
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="col-md-7">
                            <Card.Body className="p-4">
                                <div className="mb-2">
                                    <span
                                        className="badge rounded-pill"
                                        style={{ backgroundColor: stockStatus.bg, color: stockStatus.color }}
                                    >
                                        {stockStatus.icon} {stockStatus.text}
                                    </span>
                                    {product.category && (
                                        <span className="badge bg-secondary ms-2">{product.category}</span>
                                    )}
                                </div>
                                <Card.Title className="mb-2" style={{ fontSize: '1.5rem' }}>
                                    {product.name}
                                </Card.Title>
                                <div className="d-flex align-items-baseline gap-2 mb-3">
                                    <span className="h4 text-dark mb-0">₹{product.price}</span>
                                    {discount != null && (
                                        <>
                                            <span className="text-muted text-decoration-line-through">₹{product.mrp}</span>
                                            <span className="badge bg-success">{discount}% off</span>
                                        </>
                                    )}
                                </div>
                                {product.description && (
                                    <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                                        {product.description}
                                    </p>
                                )}
                                {product.productTag && (
                                    <p className="text-muted small mb-3">Tag: {product.productTag}</p>
                                )}
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        variant="primary"
                                        onClick={addToCart}
                                        disabled={product.stock === 0 || adding}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <ShoppingCart size={18} />
                                        {adding ? 'Adding...' : 'Add to Cart'}
                                    </Button>
                                    <Button variant="outline-secondary" onClick={() => navigate('/')}>
                                        Continue Shopping
                                    </Button>
                                </div>
                                {showLoginPopup && (
                                    <div className="mt-3 p-3 bg-warning bg-opacity-10 border border-warning rounded">
                                        <p className="mb-2 small">Please log in to add items to your cart.</p>
                                        <Button size="sm" variant="warning" onClick={() => navigate('/login')}>
                                            Go to Login
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetail;
