import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spinner, Badge, Button, ProgressBar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { 
    Package, 
    Calendar, 
    Truck, 
    CheckCircle, 
    Clock, 
    XCircle, 
    ChevronRight, 
    ShoppingBag, 
    ArrowLeft, 
    RefreshCw,
    MapPin,
    CreditCard,
    AlertCircle,
    Info,
    TrendingUp,
    Gift,
    Star,
    Timer,
    Box,
    Home,
    TrendingDown
} from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { OrderCardSkeleton } from '../../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTimeline, setShowTimeline] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setRefreshing(true);
            const res = await API.get('/orders');
            // Sort orders by date (newest first)
            const sortedOrders = res.data.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
            toast.success('Orders refreshed');
        } catch (err) {
            console.error('Failed to fetch orders:', err.response?.data || err.message);
            toast.error('Failed to refresh orders');
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    // Helper to normalize old statuses to standard ones
    const normalizeStatus = (status) => {
        if (!status) return 'pending';
        const lower = status.toLowerCase();
        // Map old statuses to new standard
        if (lower === 'placed' || lower === 'confirmed') return 'pending';
        if (lower === 'shipped' || lower === 'delivered') return 'completed';
        return lower; // Return as-is if already standard
    };

    const getStatusIcon = (status) => {
        const normalized = normalizeStatus(status);
        switch(normalized) {
            case 'pending':
                return <Clock size={16} className="me-1" />;
            case 'processing':
                return <Truck size={16} className="me-1" />;
            case 'completed':
                return <CheckCircle size={16} className="me-1" />;
            case 'cancelled':
                return <XCircle size={16} className="me-1" />;
            default:
                return <Package size={16} className="me-1" />;
        }
    };

    const getStatusColor = (status) => {
        const normalized = normalizeStatus(status);
        switch(normalized) {
            case 'pending':
                return { bg: '#fff3e0', color: '#f57c00', text: 'Pending' };
            case 'processing':
                return { bg: '#e8f5e8', color: '#388e3c', text: 'Processing' };
            case 'completed':
                return { bg: '#e8f5e9', color: '#2e7d32', text: 'Completed' };
            case 'cancelled':
                return { bg: '#ffebee', color: '#d32f2f', text: 'Cancelled' };
            default:
                return { bg: '#f5f5f5', color: '#616161', text: normalized || status };
        }
    };

    const getStatusBadge = (status) => {
        const statusInfo = getStatusColor(status);
        return (
            <Badge 
                style={{ 
                    backgroundColor: statusInfo.bg,
                    // color: statusInfo.color,
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: 'none'
                }}
                className="d-flex align-items-center"
            >
                {getStatusIcon(status)}
                {statusInfo.text}
            </Badge>
        );
    };

    const getOrderProgress = (status) => {
        const normalized = normalizeStatus(status);
        const progress = {
            'pending': 25,
            'processing': 50,
            'completed': 100,
            'cancelled': 0
        };
        return progress[normalized] || 0;
    };

    const getEstimatedDelivery = (order) => {
        const normalized = normalizeStatus(order.status);
        if (normalized === 'completed') {
            return 'Completed';
        }
        if (normalized === 'cancelled') {
            return 'Cancelled';
        }
        
        // Calculate estimated delivery (7 days from order date)
        const orderDate = new Date(order.createdAt);
        const deliveryDate = new Date(orderDate.setDate(orderDate.getDate() + 7));
        const today = new Date();
        
        if (deliveryDate < today) {
            return 'Delivery delayed';
        }
        
        const daysLeft = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
        return `Expected by ${deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${daysLeft} days left)`;
    };

    const getOrderTimeline = (order) => {
        const normalized = normalizeStatus(order.status);
        const timeline = [
            { status: 'Pending', completed: ['pending', 'processing', 'completed'].includes(normalized), date: order.createdAt },
            { status: 'Processing', completed: ['processing', 'completed'].includes(normalized), date: order.updatedAt },
            { status: 'Completed', completed: normalized === 'completed', date: order.updatedAt }
        ];
        
        if (normalized === 'cancelled') {
            return [
                { status: 'Pending', completed: true, date: order.createdAt },
                { status: 'Cancelled', completed: true, date: order.updatedAt, cancelled: true }
            ];
        }
        
        return timeline;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
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

    const isNewOrder = (order) => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const diffHours = Math.abs(now - orderDate) / (1000 * 60 * 60);
        return diffHours < 24; // Orders less than 24 hours old
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
        <div style={{ minHeight: '100vh', backgroundColor: '#eef7ff' }}>
            <AppNavbar />
            <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 15px' }}>
                {/* Header with Stats */}
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <Button
                                variant="link"
                                onClick={() => navigate('/')}
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
                </div>

                {orders.length === 0 ? (
                    <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '16px' }}>
                        <Card.Body style={{ padding: '60px 20px' }}>
                            <div style={{ 
                                background: '#f8f9fa', 
                                borderRadius: '50%', 
                                width: '100px', 
                                height: '100px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <Package size={45} color="#adb5bd" />
                            </div>
                            <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>No orders yet</h5>
                            <p className="text-muted small mb-4" style={{ maxWidth: '300px', margin: '0 auto 20px' }}>
                                Looks like you haven't placed any orders. Start shopping to see your orders here!
                            </p>
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/customer/product-catalog')}
                                style={{ 
                                    padding: '10px 30px', 
                                    fontSize: '14px',
                                    borderRadius: '25px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none'
                                }}
                            >
                                <ShoppingBag size={16} className="me-2" />
                                Start Shopping
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => {
                            const isNew = isNewOrder(order);
                            const progress = getOrderProgress(order.status);
                            const statusInfo = getStatusColor(order.status);
                            const estimatedDelivery = getEstimatedDelivery(order);
                            const timeline = getOrderTimeline(order);
                            
                            return (
                                <Card 
                                    key={order._id} 
                                    className="border-0 shadow-sm mb-3" 
                                    style={{ 
                                        borderRadius: '16px', 
                                        overflow: 'hidden',
                                        border: isNew ? '2px solid #4a90e2' : 'none',
                                        position: 'relative'
                                    }}
                                >
                                    {/* New Order Badge */}
                                    {isNew && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            zIndex: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                        }}>
                                            <Gift size={12} />
                                            New Order
                                        </div>
                                    )}

                                    {/* Order Header */}
                                    <div style={{ 
                                        // background: '#f8f9fa',
                                        background: '#cbe6ff',
                                        padding: '15px',
                                        borderBottom: '1px solid #e9ecef'
                                    }}>
                                        <Row className="align-items-center">
                                            <Col xs={7}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{ 
                                                        background: 'white', 
                                                        borderRadius: '10px', 
                                                        padding: '8px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Package size={20} color={statusInfo.color} />
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                                #{order.orderId || order._id.slice(-8).toUpperCase()}
                                                            </span>
                                                            {isNew && (
                                                                <Badge 
                                                                    style={{
                                                                        background: '#4a90e2',
                                                                        fontSize: '10px',
                                                                        padding: '3px 8px'
                                                                    }}
                                                                >
                                                                    Just Now
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2 mt-1">
                                                            <div className="d-flex align-items-center text-muted" style={{ fontSize: '11px' }}>
                                                                <Calendar size={11} className="me-1" />
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                            <span className="text-muted" style={{ fontSize: '11px' }}>•</span>
                                                            <div className="d-flex align-items-center text-muted" style={{ fontSize: '11px' }}>
                                                                <Clock size={11} className="me-1" />
                                                                {formatTime(order.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={5} className="text-end tx">
                                                {getStatusBadge(order.status)}
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Order Progress Bar (for active orders) */}
                                    {!['cancelled', 'delivered'].includes(order.status?.toLowerCase()) && (
                                        <div style={{ padding: '10px 15px', background: 'white' }}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span style={{ fontSize: '11px', color: '#6c757d' }}>Order Progress</span>
                                                <span style={{ fontSize: '11px', fontWeight: '600', color: statusInfo.color }}>
                                                    {progress}%
                                                </span>
                                            </div>
                                            <ProgressBar 
                                                now={progress} 
                                                style={{ height: '6px', borderRadius: '3px' }}
                                                variant={order.status?.toLowerCase() === 'cancelled' ? 'danger' : 'primary'}
                                            />
                                            <div style={{ fontSize: '11px', color: statusInfo.color, marginTop: '6px' }}>
                                                {estimatedDelivery}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <Card.Body style={{ padding: '15px' }}>
                                        {order.items.map((item, itemIndex) => (
                                            <div key={item.product?._id || itemIndex}>
                                                <Row className="align-items-center">
                                                    <Col xs={2} style={{ maxWidth: '60px' }}>
                                                        <div style={{ 
                                                            width: '50px', 
                                                            height: '50px', 
                                                            background: '#f8f9fa', 
                                                            borderRadius: '10px',
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            border: '1px solid #e9ecef',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {item.product?.image ? 
                                                                <img 
                                                                    src={`http://localhost:5000/uploads/${item.product.image}`}
                                                                    alt={item.product.name} 
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        height: '100%', 
                                                                        objectFit: 'cover'
                                                                    }} 
                                                                /> 
                                                                : <Package size={24} color="#adb5bd" />
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col xs={7}>
                                                        <h6 style={{ 
                                                            fontSize: '14px', 
                                                            fontWeight: '500',
                                                            marginBottom: '4px'
                                                        }}>
                                                            {item.product?.name || 'Product'}
                                                        </h6>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                                                Qty: {item.quantity}
                                                            </span>
                                                            {item.product?.brand && (
                                                                <>
                                                                    <span style={{ fontSize: '12px', color: '#6c757d' }}>•</span>
                                                                    <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                                                        {item.product.brand}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col xs={3} className="text-end">
                                                        <span style={{ 
                                                            fontSize: '15px', 
                                                            fontWeight: '700',
                                                            color: '#212529'
                                                        }}>
                                                            ₹{item.price * item.quantity}
                                                        </span>
                                                        {item.product?.mrp > item.price && (
                                                            <div style={{ fontSize: '11px', color: '#6c757d', textDecoration: 'line-through' }}>
                                                                ₹{item.product.mrp * item.quantity}
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                                {itemIndex < order.items.length - 1 && (
                                                    <hr style={{ margin: '12px 0', opacity: '0.5' }} />
                                                )}
                                            </div>
                                        ))}
                                    </Card.Body>

                                    {/* Order Timeline (Expandable) */}
                                    {showTimeline[order._id] && (
                                        <div style={{ 
                                            padding: '15px', 
                                            // background: '#f8f9fa',
                                            background: '#cbe6ff',
                                            borderTop: '1px solid #e9ecef',
                                            borderBottom: '1px solid #e9ecef',
                                            opacity: '80%',
                                        }}>
                                            <h6 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                                                Order Timeline
                                            </h6>
                                            <div style={{ position: 'relative', paddingLeft: '20px' }}>
                                                {timeline.map((step, idx) => (
                                                    <div key={idx} style={{ 
                                                        position: 'relative',
                                                        paddingBottom: idx < timeline.length - 1 ? '20px' : '0'
                                                    }}>
                                                        {/* Timeline line */}
                                                        {idx < timeline.length - 1 && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                left: '-12px',
                                                                top: '16px',
                                                                bottom: '0',
                                                                width: '2px',
                                                                background: step.completed ? '#4a90e2' : '#e9ecef',
                                                                content: '""'
                                                            }} />
                                                        )}
                                                        
                                                        {/* Timeline dot */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: '-16px',
                                                            top: '4px',
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '50%',
                                                            background: step.completed 
                                                                ? (step.cancelled ? '#dc3545' : '#4a90e2')
                                                                : '#e9ecef',
                                                            border: step.completed ? 'none' : '2px solid white',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }} />
                                                        
                                                        <div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span style={{ 
                                                                    fontSize: '13px', 
                                                                    fontWeight: step.completed ? '600' : '400',
                                                                    color: step.completed ? (step.cancelled ? '#dc3545' : '#212529') : '#6c757d'
                                                                }}>
                                                                    {step.status}
                                                                </span>
                                                                {step.completed && step.date && (
                                                                    <span style={{ fontSize: '11px', color: '#6c757d' }}>
                                                                        {formatDate(step.date)} at {formatTime(step.date)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.statusHistory?.length > 0 && (
                                                <>
                                                    <h6 style={{ fontSize: '13px', fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>
                                                        Status history
                                                    </h6>
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        {order.statusHistory.map((entry, i) => (
                                                            <div key={i} className="d-flex justify-content-between align-items-center py-1">
                                                                <div>
                                                                    <span className="text-capitalize">{entry.status}</span>
                                                                    {entry.updatedByName && (
                                                                        <span className="ms-2 text-muted" style={{ fontSize: '11px' }}>
                                                                            by {entry.updatedByName}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span>{entry.updatedAt ? formatDate(entry.updatedAt) + ' ' + formatTime(entry.updatedAt) : '—'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Order Footer */}
                                    <div style={{ 
                                        background: 'white',
                                        padding: '12px 15px',
                                        borderTop: '2px solid #efe9ef',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total:
                                            </span>
                                            <span style={{ 
                                                fontSize: '16px', 
                                                fontWeight: '700',
                                                color: '#28a745',
                                                marginLeft: '5px'
                                            }}>
                                                ₹{order.totalAmount}
                                            </span>
                                            {order.paymentMethod && (
                                                <div className="d-flex align-items-center gap-1 mt-1">
                                                    <CreditCard size={11} color="#6c757d" />
                                                    <span style={{ fontSize: '11px', color: '#6c757d' }}>
                                                        {order.paymentMethod}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="link" 
                                                size="sm"
                                                onClick={() => setShowTimeline({
                                                    ...showTimeline,
                                                    [order._id]: !showTimeline[order._id]
                                                })}
                                                className='fw-semibold'
                                                style={{ 
                                                    fontSize: '13px',
                                                    textDecoration: 'none',
                                                    color: '#667eea',
                                                    padding: '5px 10px'
                                                }}
                                            >
                                                {showTimeline[order._id] ? 'Hide Timeline' : 'Show Timeline'}
                                            </Button>
                                            {/* <Button 
                                                variant="primary"
                                                size="sm"
                                                onClick={() => navigate(`/customer/orders/${order._id}`)}
                                                style={{ 
                                                    fontSize: '12px',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    padding: '6px 15px',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                View Details
                                                <ChevronRight size={14} />
                                            </Button> */}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                        
                        {/* Back to Top Button */}
                        <div className="text-center mt-4">
                            <Button
                                variant="link"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                style={{ 
                                    fontSize: '12px',
                                    color: '#6c757d',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <TrendingUp size={14} />
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