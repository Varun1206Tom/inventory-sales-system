import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Modal, Row, Col } from 'react-bootstrap';
import API from '../../services/axios';
import { toast } from 'react-toastify';
import { TableRowSkeleton } from '../../components/Skeleton';

const OrderManagement = () => {
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

    const handleStatusChange = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModal(true);
    };

    const updateOrderStatus = async () => {
        if (!newStatus || newStatus === selectedOrder.status) {
            toast.error('Please select a different status');
            return;
        }

        try {
            await API.put(`/staff/orders/${selectedOrder._id}`, { status: newStatus });
            toast.success('Order status updated successfully');
            setShowModal(false);
            loadOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update order');
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

    const getStatusOptions = () => {
        const statuses = ['placed', 'processing', 'completed', 'cancelled'];
        return statuses.filter(status => status !== selectedOrder?.status);
    };

    const styles = {
        container: {
            padding: '0'
        },
        filterSection: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
        },
        filterControl: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        },
        label: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#495057'
        },
        input: {
            borderRadius: '6px',
            border: '1px solid #dee2e6',
            padding: '8px 12px',
            fontSize: '13px',
            height: '36px'
        },
        tableHeader: {
            backgroundColor: '#f8f9fa',
            padding: '10px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#495057',
            textAlign: 'left',
            borderBottom: '1px solid #dee2e6',
            textTransform: 'uppercase'
        },
        tableCell: {
            padding: '10px 12px',
            fontSize: '13px',
            color: '#2c3e50',
            borderBottom: '1px solid #e9ecef',
            verticalAlign: 'middle'
        },
        actionButtons: {
            display: 'flex',
            gap: '6px'
        },
        statusButton: {
            backgroundColor: '#3498db',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
        },
        emptyState: {
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6c757d'
        }
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div style={styles.container}>
            {/* Filters */}
            <div style={styles.filterSection}>
                <div style={styles.filterControl}>
                    <label style={styles.label}>Search (Order ID or Customer)</label>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.filterControl}>
                    <label style={styles.label}>Filter by Status</label>
                    <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={styles.input}
                    >
                        <option value="all">All Orders</option>
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </div>
            </div>

            {/* Orders Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <Table bordered={false} style={{ margin: 0, fontSize: '13px' }} size="sm">
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Order ID</th>
                            <th style={styles.tableHeader}>Customer</th>
                            <th style={styles.tableHeader}>Items</th>
                            <th style={styles.tableHeader}>Total</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Date</th>
                            <th style={styles.tableHeader}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                            : filteredOrders.length === 0
                            ? (
                                <tr>
                                    <td colSpan="7" style={styles.emptyState}>
                                        No orders found
                                    </td>
                                </tr>
                            )
                            : filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td style={styles.tableCell}>
                                        <Badge bg="primary">{order.orderId}</Badge>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={{ fontWeight: '500' }}>{order.customerName}</div>
                                        <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                            {order.items?.length || 0} item(s)
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} style={{ fontSize: '12px' }}>
                                                {item.product?.name || 'Product'} x{item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{...styles.tableCell, fontWeight: '600', color: '#28a745'}}>
                                        ₹{order.total?.toLocaleString() || 0}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <Badge bg={getStatusColor(order.status)}>
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </Badge>
                                    </td>
                                    <td style={styles.tableCell}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleStatusChange(order)}
                                            style={{ fontSize: '11px' }}
                                        >
                                            Change
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>

            {/* Status Change Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ ...styles.label, marginBottom: '5px', display: 'block' }}>
                                    Order ID
                                </label>
                                <div style={{ color: '#2c3e50', fontWeight: '500' }}>
                                    {selectedOrder.orderId}
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ ...styles.label, marginBottom: '5px', display: 'block' }}>
                                    Current Status
                                </label>
                                <Badge bg={getStatusColor(selectedOrder.status)}>
                                    {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                                </Badge>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ ...styles.label, marginBottom: '8px', display: 'block' }}>
                                    New Status
                                </label>
                                <Form.Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="">Select Status</option>
                                    {getStatusOptions().map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            <div style={{ backgroundColor: '#e8f4f8', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#495057' }}>
                                <strong>Note:</strong> Changing the status will update the customer's order history in real-time.
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateOrderStatus}>
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManagement;
