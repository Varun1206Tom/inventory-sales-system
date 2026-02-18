import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spinner, Badge, Button } from 'react-bootstrap';
import { Package, Calendar, Truck, CheckCircle, Clock, XCircle, ChevronRight, ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { OrderCardSkeleton } from '../../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setRefreshing(true);
            const res = await API.get('/orders');
            setOrders(res.data);
            toast.success('Orders refreshed');
        } catch (err) {
            console.error('Failed to fetch orders:', err.response?.data || err.message);
            toast.error('Failed to refresh orders');
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'placed':
                return <CheckCircle size={14} className="me-1" />;
            case 'pending':
                return <Clock size={14} className="me-1" />;
            case 'processing':
                return <Truck size={14} className="me-1" />;
            case 'cancelled':
                return <XCircle size={14} className="me-1" />;
            default:
                return <Package size={14} className="me-1" />;
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'placed': { bg: 'success', text: 'Placed' },
            'pending': { bg: 'warning', text: 'Pending' },
            'processing': { bg: 'info', text: 'Processing' },
            'cancelled': { bg: 'danger', text: 'Cancelled' },
            'delivered': { bg: 'primary', text: 'Delivered' }
        };
        const config = statusConfig[status] || { bg: 'secondary', text: status };
        
        return (
            <Badge 
                bg={config.bg}
                className="d-flex align-items-center px-3 py-2"
                style={{ fontSize: '12px', fontWeight: '500' }}
            >
                {getStatusIcon(status)}
                {config.text}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <AppNavbar />
                <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 15px' }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Button variant="link" style={{ color: '#666', padding: 0 }} disabled><ArrowLeft size={20} /></Button>
                        <h5 className="mb-0">My Orders</h5>
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AppNavbar />
            <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 15px' }}>
                {/* Header with Back Button */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="link"
                            onClick={() => navigate(-1)}
                            style={{ 
                                color: '#666',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                textDecoration: 'none'
                            }}
                        >
                            <ArrowLeft size={18} />
                            <span style={{ fontSize: '14px' }}>Back</span>
                        </Button>
                        <div>
                            <h5 className="mb-1" style={{ fontWeight: '600' }}>My Orders</h5>
                            <p className="text-muted small mb-0">
                                {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={fetchOrders}
                            disabled={refreshing}
                            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                            {refreshing ? 'Refreshing' : 'Refresh'}
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate('/customer/product-catalog')}
                            style={{ fontSize: '13px' }}
                        >
                            <ShoppingBag size={14} className="me-1" />
                            Shop More
                        </Button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
                        <Card.Body style={{ padding: '50px 20px' }}>
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                                 style={{ width: '80px', height: '80px' }}>
                                <Package size={35} className="text-muted" />
                            </div>
                            <h6 style={{ fontWeight: '600', marginBottom: '8px' }}>No orders yet</h6>
                            <p className="text-muted small mb-3">Looks like you haven't placed any orders</p>
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => navigate('/customer/product-catalog')}
                                style={{ padding: '8px 20px', fontSize: '14px' }}
                            >
                                Start Shopping
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <Card 
                                key={order._id} 
                                className="border-0 shadow-sm mb-3" 
                                style={{ borderRadius: '12px', overflow: 'hidden' }}
                            >
                                {/* Order Header */}
                                <div style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '12px 15px',
                                    borderBottom: '1px solid #e9ecef'
                                }}>
                                    <Row className="align-items-center">
                                        <Col xs={6}>
                                            <div className="d-flex align-items-center gap-2">
                                                <Package size={16} className="text-primary" />
                                                <div>
                                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                                        #{order.orderId || order._id.slice(-8).toUpperCase()}
                                                    </span>
                                                    <div className="d-flex align-items-center gap-2 mt-1">
                                                        <div className="d-flex align-items-center text-muted" style={{ fontSize: '11px' }}>
                                                            <Calendar size={11} className="me-1" />
                                                            {formatDate(order.createdAt)}
                                                        </div>
                                                        <span className="text-muted" style={{ fontSize: '11px' }}>•</span>
                                                        <div className="d-flex align-items-center text-muted" style={{ fontSize: '11px' }}>
                                                            {formatTime(order.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="text-end">
                                            {getStatusBadge(order.status)}
                                        </Col>
                                    </Row>
                                </div>

                                {/* Order Items */}
                                <Card.Body style={{ padding: '12px 15px' }}>
                                    {order.items.map((item, itemIndex) => (
                                        <div key={item.product?._id || itemIndex}>
                                            <Row className="align-items-center">
                                                <Col xs={2} style={{ maxWidth: '50px' }}>
                                                    <div style={{ 
                                                        width: '45px', 
                                                        height: '45px', 
                                                        background: '#f1f3f5', 
                                                        borderRadius: '8px',
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        border: '1px solid #e9ecef'
                                                    }}>
                                                        {item.product?.image ? 
                                                            <img 
                                                                src={item.product.image ? `http://localhost:5000/uploads/${item.product.image}` : '/placeholder.png'} 
                                                                alt={item.product.name} 
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '100%', 
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }} 
                                                            /> 
                                                            : <Package size={20} color="#adb5bd" />
                                                        }
                                                    </div>
                                                </Col>
                                                <Col xs={7}>
                                                    <h6 style={{ 
                                                        fontSize: '14px', 
                                                        fontWeight: '500',
                                                        marginBottom: '2px'
                                                    }}>
                                                        {item.product?.name || 'Product'}
                                                    </h6>
                                                    <p style={{ 
                                                        fontSize: '12px', 
                                                        color: '#6c757d',
                                                        marginBottom: '2px'
                                                    }}>
                                                        Qty: {item.quantity}
                                                    </p>
                                                </Col>
                                                <Col xs={3} className="text-end">
                                                    <span style={{ 
                                                        fontSize: '14px', 
                                                        fontWeight: '600',
                                                        color: '#212529'
                                                    }}>
                                                        ₹{item.price * item.quantity}
                                                    </span>
                                                </Col>
                                            </Row>
                                            {itemIndex < order.items.length - 1 && (
                                                <hr style={{ margin: '10px 0', opacity: '0.5' }} />
                                            )}
                                        </div>
                                    ))}
                                </Card.Body>

                                {/* Order Footer */}
                                <div style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '10px 15px',
                                    borderTop: '1px solid #e9ecef',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • 
                                        </span>
                                        <span style={{ 
                                            fontSize: '14px', 
                                            fontWeight: '600',
                                            color: '#28a745',
                                            marginLeft: '5px'
                                        }}>
                                            ₹{order.totalAmount}
                                        </span>
                                    </div>
                                    <Button 
                                        variant="link" 
                                        size="sm"
                                        onClick={() => navigate(`/customer/orders/${order._id}`)}
                                        style={{ 
                                            fontSize: '12px',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '3px',
                                            padding: '5px 10px'
                                        }}
                                    >
                                        View Details
                                        <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        
                        {/* Back to Top Button */}
                        <div className="text-center mt-3">
                            <Button
                                variant="link"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                style={{ 
                                    fontSize: '12px',
                                    color: '#6c757d',
                                    textDecoration: 'none'
                                }}
                            >
                                Back to Top
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;