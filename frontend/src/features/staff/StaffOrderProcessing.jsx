import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Modal, Row, Col } from 'react-bootstrap';
import API from '../../services/axios';
import { toast } from 'react-toastify';
import { Search, Filter, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import Navbar from '../../components/AppNavbar';

const StaffOrderProcessing = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await API.get('/staff/orders');
            setOrders(res.data);
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

    const getFilteredOrders = () => {
        let filtered = orders;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(order => order.status === filterStatus);
        }

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const handleProcessOrder = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModal(true);
    };

    const processOrder = async () => {
        if (!newStatus || newStatus === selectedOrder.status) {
            toast.error('Please select a different status');
            return;
        }

        try {
            await API.put(`/staff/orders/${selectedOrder._id}/process`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}. Stock updated!`);
            setShowModal(false);
            loadOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to process order');
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'placed': 'success',
            'pending': 'warning',
            'processing': 'info',
            'completed': 'primary',
            'cancelled': 'danger'
        };
        return colors[status] || 'secondary';
    };

    const getStatusIcon = (status) => {
        if (status === 'pending') return <Clock size={14} />;
        if (status === 'processing') return <RefreshCw size={14} />;
        if (status === 'completed') return <CheckCircle size={14} />;
        return null;
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div>
            <Navbar />
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
            <div className="container-fluid px-4 py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1 fw-bold">Order Processing</h3>
                        <p className="text-muted mb-0">Process orders and manage stock deduction</p>
                    </div>
                    <Button variant="outline-secondary" onClick={loadOrders} disabled={loading}>
                        <RefreshCw size={16} className="me-2" />
                        Refresh
                    </Button>
                </div>

                {/* Filter Bar */}
                <Row className="g-3 mb-4">
                    <Col md={6}>
                        <div className="position-relative">
                            <Search size={16} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#adb5bd' }} />
                            <Form.Control
                                placeholder="Search by Order ID or Customer Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '35px' }}
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <Form.Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border"
                        >
                            <option value="all">All Orders</option>
                            <option value="placed">Placed</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Col>
                </Row>

                {/* Stats */}
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <div className="bg-white p-3 rounded border">
                            <p className="text-muted small mb-1">Total Orders</p>
                            <h4 className="fw-bold mb-0">{orders.length}</h4>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="bg-white p-3 rounded border">
                            <p className="text-muted small mb-1">Pending</p>
                            <h4 className="fw-bold mb-0 text-warning">{orders.filter(o => o.status === 'pending').length}</h4>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="bg-white p-3 rounded border">
                            <p className="text-muted small mb-1">Processing</p>
                            <h4 className="fw-bold mb-0 text-info">{orders.filter(o => o.status === 'processing').length}</h4>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="bg-white p-3 rounded border">
                            <p className="text-muted small mb-1">Completed</p>
                            <h4 className="fw-bold mb-0 text-success">{orders.filter(o => o.status === 'completed').length}</h4>
                        </div>
                    </Col>
                </Row>

                {/* Orders Table */}
                <div className="bg-white rounded border shadow-sm">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="fw-semibold">Order ID</th>
                                    <th className="fw-semibold">Customer</th>
                                    <th className="fw-semibold">Items</th>
                                    <th className="fw-semibold">Total</th>
                                    <th className="fw-semibold">Status</th>
                                    <th className="fw-semibold">Date</th>
                                    <th className="fw-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <div className="spinner-border text-success" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>
                                                <span className="fw-bold text-success">#{order.orderId}</span>
                                            </td>
                                            <td>{order.customerName}</td>
                                            <td>
                                                <Badge bg="light" text="dark">{order.items?.length || 0} items</Badge>
                                            </td>
                                            <td className="fw-bold">₹{order.totalAmount?.toLocaleString()}</td>
                                            <td>
                                                <Badge bg={getStatusColor(order.status)} className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleProcessOrder(order)}
                                                    disabled={order.status === 'completed' || order.status === 'cancelled'}
                                                >
                                                    Process
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <p className="text-muted mb-0">No orders found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            </div>

            {/* Process Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Process Order #{selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3 p-3 bg-light rounded">
                        <p className="mb-1"><strong>Customer:</strong> {selectedOrder?.customerName}</p>
                        <p className="mb-1"><strong>Items:</strong> {selectedOrder?.items?.length}</p>
                        <p className="mb-0"><strong>Total:</strong> ₹{selectedOrder?.totalAmount?.toLocaleString()}</p>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Update Status</Form.Label>
                        <div className="d-grid gap-2">
                            {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                                <Button
                                    key={status}
                                    variant={newStatus === status ? 'success' : 'outline-secondary'}
                                    onClick={() => setNewStatus(status)}
                                    className="text-start"
                                >
                                    <Badge bg={getStatusColor(status)} className="me-2">
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                </Button>
                            ))}
                        </div>
                    </Form.Group>

                    {newStatus === 'completed' && (
                        <div className="alert alert-warning mb-0">
                            <small>⚠️ Stock will be deducted from inventory when you complete this order.</small>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={processOrder}>
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StaffOrderProcessing;
