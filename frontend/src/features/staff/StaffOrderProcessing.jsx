import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Modal, Row, Col, Pagination } from 'react-bootstrap';
import API from '../../services/axios';
import { toast } from 'react-toastify';
import { 
    Search, 
    Filter, 
    CheckCircle, 
    Clock, 
    RefreshCw, 
    Package, 
    XCircle,
    Eye,
    Mail,
    Phone,
    CreditCard,
    ShoppingBag,
    ArrowLeft
} from 'lucide-react';
import Navbar from '../../components/AppNavbar';
import { useNavigate } from 'react-router-dom';

const StaffOrderProcessing = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
    });

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await API.get('/staff/orders');
            setOrders(res.data);
            calculateStats(res.data);
        } catch (err) {
            toast.error('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Helper to normalize old statuses to standard ones
    const normalizeStatus = (status) => {
        if (!status) return 'pending';
        const lower = status.toLowerCase();
        // Map old statuses to new standard
        if (lower === 'placed' || lower === 'confirmed') return 'pending';
        if (lower === 'shipped' || lower === 'delivered') return 'completed';
        return lower; // Return as-is if already standard
    };

    const calculateStats = (ordersData) => {
        const total = ordersData.length;
        const revenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        // Count orders with normalized statuses (handle old statuses)
        const pending = ordersData.filter(o => {
            const s = normalizeStatus(o.status);
            return s === 'pending';
        }).length;
        const processing = ordersData.filter(o => normalizeStatus(o.status) === 'processing').length;
        const completed = ordersData.filter(o => normalizeStatus(o.status) === 'completed').length;
        const cancelled = ordersData.filter(o => normalizeStatus(o.status) === 'cancelled').length;

        setStats({
            totalOrders: total,
            totalRevenue: revenue,
            pendingOrders: pending,
            processingOrders: processing,
            completedOrders: completed,
            cancelledOrders: cancelled
        });
    };

    const getFilteredOrders = () => {
        let filtered = [...orders];

        // Status filter (normalize old statuses)
        if (filterStatus !== 'all') {
            filtered = filtered.filter(order => {
                const normalized = normalizeStatus(order.status);
                return normalized === filterStatus;
            });
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return filtered;
    };

    // Pagination
    const filteredOrders = getFilteredOrders();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleProcessOrder = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModal(true);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const processOrder = async () => {
        if (!newStatus || newStatus === selectedOrder.status) {
            toast.error('Please select a different status');
            return;
        }

        try {
            await API.put(`/staff/orders/${selectedOrder._id}/process`, { status: newStatus });
            toast.success(`Order #${selectedOrder.orderId} marked as ${newStatus.toUpperCase()}!`);
            setShowModal(false);
            loadOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to process order');
        }
    };

    const getStatusStyle = (status) => {
        // Normalize old statuses to new standard
        const normalizedStatus = normalizeStatus(status);
        const styles = {
            'pending': { bg: '#fff3e0', color: '#f57c00', text: 'Pending' },
            'processing': { bg: '#e8f5e8', color: '#2e7d32', text: 'Processing' },
            'completed': { bg: '#e8f5e9', color: '#2e7d32', text: 'Completed' },
            'cancelled': { bg: '#ffebee', color: '#d32f2f', text: 'Cancelled' }
        };
        return styles[normalizedStatus] || { bg: '#f5f5f5', color: '#616161', text: normalizedStatus || status };
    };

    const getStatusIcon = (status) => {
        const normalized = normalizeStatus(status);
        switch(normalized) {
            case 'pending': return <Clock size={12} />;
            case 'processing': return <RefreshCw size={12} />;
            case 'completed': return <CheckCircle size={12} />;
            case 'cancelled': return <XCircle size={12} />;
            default: return <Package size={12} />;
        }
    };

    // Styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: '#f8f9fa'
        },
        content: {
            padding: '20px'
        },
        header: {
            background: 'white',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e9ecef'
        },
        backButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            color: '#495057',
            fontSize: '13px',
            cursor: 'pointer'
        },
        statsCard: {
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e9ecef'
        },
        filterBar: {
            background: 'white',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '20px',
            border: '1px solid #e9ecef'
        },
        tableContainer: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            background: '#f8f9fa',
            padding: '12px 16px',
            textAlign: 'left',
            fontSize: '13px',
            fontWeight: '600',
            color: '#495057',
            borderBottom: '1px solid #e9ecef'
        },
        td: {
            padding: '12px 16px',
            fontSize: '13px',
            borderBottom: '1px solid #e9ecef',
            verticalAlign: 'middle'
        },
        orderId: {
            fontFamily: 'monospace',
            fontWeight: '600',
            color: '#495057'
        },
        customerName: {
            fontWeight: '500',
            color: '#212529'
        },
        customerEmail: {
            fontSize: '11px',
            color: '#6c757d',
            marginTop: '2px'
        },
        itemsBadge: {
            background: '#f1f8e9',
            color: '#33691e',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
        },
        amount: {
            fontWeight: '600',
            color: '#2e7d32'
        },
        statusBadge: (status) => ({
            background: getStatusStyle(status).bg,
            color: getStatusStyle(status).color,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            width: 'fit-content'
        }),
        date: {
            color: '#6c757d',
            fontSize: '12px'
        },
        actionBtn: {
            padding: '4px 8px',
            margin: '0 2px',
            fontSize: '11px',
            borderRadius: '4px'
        },
        processBtn: (disabled) => ({
            padding: '4px 12px',
            background: disabled ? '#e9ecef' : '#0d6efd',
            color: disabled ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            cursor: disabled ? 'not-allowed' : 'pointer'
        }),
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            padding: '16px',
            borderTop: '1px solid #e9ecef'
        },
        pageItem: (active) => ({
            padding: '6px 12px',
            background: active ? '#0d6efd' : 'white',
            color: active ? 'white' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            minWidth: '32px',
            textAlign: 'center'
        })
    };

    return (
        <div style={styles.container}>
            <Navbar />
            
            <div style={styles.content}>
                <div className="container-fluid px-4">
                    {/* Header */}
                    <div style={styles.header} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <button 
                                style={styles.backButton}
                                onClick={() => navigate('/staff')}
                            >
                                <ArrowLeft size={14} />
                                Back
                            </button>
                            <div>
                                <h5 className="mb-0 fw-bold">Order Processing</h5>
                                <small className="text-muted">Manage and process customer orders</small>
                            </div>
                        </div>
                        <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={loadOrders} 
                            disabled={loading}
                        >
                            <RefreshCw size={14} className="me-1" />
                            Refresh
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <Row className="g-3 mb-4">
                        <Col md={3}>
                            <div style={styles.statsCard}>
                                <small className="text-muted d-block mb-1">Total Orders</small>
                                <h4 className="mb-0 fw-bold">{stats.totalOrders}</h4>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div style={styles.statsCard}>
                                <small className="text-muted d-block mb-1">Total Revenue</small>
                                <h4 className="mb-0 fw-bold">₹{stats.totalRevenue.toLocaleString()}</h4>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div style={styles.statsCard}>
                                <small className="text-muted d-block mb-1">Pending</small>
                                <h4 className="mb-0 fw-bold" style={{ color: '#f57c00' }}>{stats.pendingOrders}</h4>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div style={styles.statsCard}>
                                <small className="text-muted d-block mb-1">Completed</small>
                                <h4 className="mb-0 fw-bold" style={{ color: '#2e7d32' }}>{stats.completedOrders}</h4>
                            </div>
                        </Col>
                    </Row>

                    {/* Filter Bar */}
                    <div style={styles.filterBar}>
                        <Row className="g-3">
                            <Col md={6}>
                                <div className="position-relative">
                                    <Search size={14} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#adb5bd' }} />
                                    <Form.Control
                                        placeholder="Search by Order ID or Customer..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '35px', height: '38px' }}
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ height: '38px' }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="placed">Placed</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Col>
                            <Col md={2} className="text-end">
                                <Badge bg="light" text="dark" style={{ padding: '8px 12px' }}>
                                    {filteredOrders.length} orders
                                </Badge>
                            </Col>
                        </Row>
                    </div>

                    {/* Orders Table */}
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Order ID</th>
                                    <th style={styles.th}>Customer</th>
                                    <th style={styles.th}>Items</th>
                                    <th style={styles.th}>Total</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="text-muted small mb-0">Loading orders...</p>
                                        </td>
                                    </tr>
                                ) : currentOrders.length > 0 ? (
                                    currentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td style={styles.td}>
                                                <span style={styles.orderId}>#{order.orderId}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.customerName}>{order.customerName}</div>
                                                <div style={styles.customerEmail}>{order.customerEmail}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.itemsBadge}>
                                                    <Package size={10} />
                                                    {order.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.amount}>₹{order.totalAmount?.toLocaleString()}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.statusBadge(order.status)}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusStyle(order.status).text}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.date}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(order)}
                                                    style={styles.actionBtn}
                                                >
                                                    <Eye size={12} />
                                                </Button>
                                                <button
                                                    style={styles.processBtn(order.status === 'completed' || order.status === 'cancelled')}
                                                    onClick={() => handleProcessOrder(order)}
                                                    disabled={normalizeStatus(order.status) === 'completed' || normalizeStatus(order.status) === 'cancelled'}
                                                >
                                                    Process
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                            <Package size={30} color="#adb5bd" className="mb-2" />
                                            <h6 className="mb-1">No orders found</h6>
                                            <p className="text-muted small mb-0">Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {filteredOrders.length > itemsPerPage && (
                            <div style={styles.pagination}>
                                <button
                                    style={styles.pageItem(false)}
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        style={styles.pageItem(currentPage === i + 1)}
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    style={styles.pageItem(false)}
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Process Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Process Order #{selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="bg-light p-3 rounded mb-3">
                        <p className="mb-1"><strong>Customer:</strong> {selectedOrder?.customerName}</p>
                        <p className="mb-1"><strong>Items:</strong> {selectedOrder?.items?.length}</p>
                        <p className="mb-0"><strong>Total:</strong> ₹{selectedOrder?.totalAmount?.toLocaleString()}</p>
                    </div>

                    <Form.Group>
                        <Form.Label>Update Status</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                                <Button
                                    key={status}
                                    size="sm"
                                    variant={newStatus === status ? 'success' : 'outline-secondary'}
                                    onClick={() => setNewStatus(status)}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" size="sm" onClick={processOrder}>
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Details Modal */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Order #{selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <div className="mb-3">
                                <h6>Customer Details</h6>
                                <p className="mb-1"><strong>{selectedOrder.customerName}</strong></p>
                                <p className="mb-1"><Mail size={12} className="me-1" /> {selectedOrder.customerEmail}</p>
                                {selectedOrder.customerPhone && (
                                    <p className="mb-0"><Phone size={12} className="me-1" /> {selectedOrder.customerPhone}</p>
                                )}
                            </div>

                            <div className="mb-3">
                                <h6>Order Items</h6>
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <span>{item.product?.name || 'Product'}</span>
                                            <small className="d-block text-muted">Qty: {item.quantity}</small>
                                        </div>
                                        <span className="fw-semibold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-2">
                                <div className="d-flex justify-content-between">
                                    <span>Total Amount:</span>
                                    <span className="fw-bold">₹{selectedOrder.totalAmount}</span>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <span>Status:</span>
                                    <span style={styles.statusBadge(selectedOrder.status)}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {getStatusStyle(selectedOrder.status).text}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <span>Order Date:</span>
                                    <small>{new Date(selectedOrder.createdAt).toLocaleString()}</small>
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="sm" onClick={() => setShowDetailsModal(false)}>
                        Close
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => {
                            setShowDetailsModal(false);
                            setShowModal(true);
                        }}
                        disabled={normalizeStatus(selectedOrder?.status) === 'completed' || normalizeStatus(selectedOrder?.status) === 'cancelled'}
                    >
                        Process Order
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StaffOrderProcessing;