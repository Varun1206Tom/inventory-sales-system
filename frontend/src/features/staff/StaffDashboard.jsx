import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/AppNavbar';
import { Card, Col, Container, Row, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import { 
    ShoppingBag, 
    Package, 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    XCircle,
    Eye,
    Search,
    Filter,
    Download,
    RefreshCw,
    Users,
    DollarSign,
    AlertCircle
} from 'lucide-react';
import API from '../../services/axios';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        totalSales: 0,
        totalCustomers: 0,
        lowStockItems: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('today');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDashboardData();
    }, [timeframe]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch stats
            const statsRes = await API.get('/staff/stats', {
                params: { timeframe },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);

            // Fetch recent orders
            const ordersRes = await API.get('/staff/recent-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentOrders(ordersRes.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { bg: 'warning', text: 'Pending', icon: Clock },
            'processing': { bg: 'info', text: 'Processing', icon: RefreshCw },
            'completed': { bg: 'success', text: 'Completed', icon: CheckCircle },
            'cancelled': { bg: 'danger', text: 'Cancelled', icon: XCircle }
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <Badge bg={config.bg} className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <Icon size={12} />
                {config.text}
            </Badge>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Navbar />
            
            <Container fluid className="px-4 py-4">
                {/* Header with Actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-1" style={{ fontWeight: '600' }}>Staff Dashboard</h3>
                        <p className="text-muted mb-0">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => setTimeframe('today')}
                            active={timeframe === 'today'}
                        >
                            Today
                        </Button>
                        <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => setTimeframe('week')}
                            active={timeframe === 'week'}
                        >
                            This Week
                        </Button>
                        <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => setTimeframe('month')}
                            active={timeframe === 'month'}
                        >
                            This Month
                        </Button>
                        <Button variant="primary" size="sm" className="ms-2">
                            <Download size={16} className="me-1" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <Row className="g-3 mb-4">
                    <Col xl={2} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="bg-warning bg-opacity-10 p-2 rounded">
                                        <Clock className="text-warning" size={20} />
                                    </div>
                                    <Badge bg="warning" className="px-2">Live</Badge>
                                </div>
                                <h4 className="mb-1 fw-bold">{stats.pendingOrders}</h4>
                                <p className="text-muted mb-0">Pending Orders</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col xl={2} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="bg-info bg-opacity-10 p-2 rounded mb-2" style={{ width: 'fit-content' }}>
                                    <RefreshCw className="text-info" size={20} />
                                </div>
                                <h4 className="mb-1 fw-bold">{stats.processingOrders}</h4>
                                <p className="text-muted mb-0">Processing Orders</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col xl={2} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="bg-success bg-opacity-10 p-2 rounded mb-2" style={{ width: 'fit-content' }}>
                                    <CheckCircle className="text-success" size={20} />
                                </div>
                                <h4 className="mb-1 fw-bold">{stats.completedOrders}</h4>
                                <p className="text-muted mb-0">Completed Orders</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col xl={2} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="bg-primary bg-opacity-10 p-2 rounded mb-2" style={{ width: 'fit-content' }}>
                                    <DollarSign className="text-primary" size={20} />
                                </div>
                                <h4 className="mb-1 fw-bold">₹{stats.totalSales?.toLocaleString()}</h4>
                                <p className="text-muted mb-0">Total Sales</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col xl={2} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="bg-info bg-opacity-10 p-2 rounded mb-2" style={{ width: 'fit-content' }}>
                                    <Users className="text-info" size={20} />
                                </div>
                                <h4 className="mb-1 fw-bold">{stats.totalCustomers}</h4>
                                <p className="text-muted mb-0">Total Customers</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col xl={2} lg={4} md={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="bg-danger bg-opacity-10 p-2 rounded mb-2" style={{ width: 'fit-content' }}>
                                    <AlertCircle className="text-danger" size={20} />
                                </div>
                                <h4 className="mb-1 fw-bold">{stats.lowStockItems}</h4>
                                <p className="text-muted mb-0">Low Stock Items</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Row */}
                <Row className="g-4">
                    {/* Quick Actions */}
                    <Col lg={8}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-semibold mb-1">Process Orders</h5>
                                                <p className="text-muted small mb-0">Manage pending and active orders</p>
                                            </div>
                                            <div className="bg-primary bg-opacity-10 p-2 rounded">
                                                <Package className="text-primary" size={24} />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted small">Pending Orders</span>
                                                <Badge bg="warning" pill>{stats.pendingOrders}</Badge>
                                            </div>
                                            <ProgressBar 
                                                now={(stats.pendingOrders / (stats.pendingOrders + stats.processingOrders + stats.completedOrders || 1)) * 100} 
                                                variant="warning" 
                                                className="mb-3"
                                                style={{ height: '8px' }}
                                            />
                                            
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted small">Processing</span>
                                                <Badge bg="info" pill>{stats.processingOrders}</Badge>
                                            </div>
                                            <ProgressBar 
                                                now={(stats.processingOrders / (stats.pendingOrders + stats.processingOrders + stats.completedOrders || 1)) * 100} 
                                                variant="info" 
                                                className="mb-3"
                                                style={{ height: '8px' }}
                                            />
                                        </div>
                                        
                                        <Button 
                                            variant="primary" 
                                            className="w-100 mt-3"
                                            onClick={() => navigate('/staff/orders')}
                                        >
                                            View All Orders
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col md={6}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-semibold mb-1">Record Sales</h5>
                                                <p className="text-muted small mb-0">Process new sales and payments</p>
                                            </div>
                                            <div className="bg-success bg-opacity-10 p-2 rounded">
                                                <TrendingUp className="text-success" size={24} />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <div className="bg-light p-3 rounded text-center mb-3">
                                                <h2 className="fw-bold text-success mb-0">₹{stats.totalSales?.toLocaleString()}</h2>
                                                <p className="text-muted small mb-0">Total Sales ({timeframe})</p>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between text-center">
                                                <div>
                                                    <h6 className="fw-bold mb-1">{stats.completedOrders}</h6>
                                                    <span className="text-muted small">Completed</span>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">{stats.pendingOrders}</h6>
                                                    <span className="text-muted small">Pending</span>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">{stats.lowStockItems}</h6>
                                                    <span className="text-muted small">Low Stock</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            variant="success" 
                                            className="w-100 mt-3"
                                            onClick={() => navigate('/staff/sales/new')}
                                        >
                                            New Sale
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            {/* Recent Orders Table */}
                            <Col md={12}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="fw-semibold mb-0">Recent Orders</h5>
                                            <div className="d-flex gap-2">
                                                <div className="position-relative">
                                                    <Search size={16} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#adb5bd' }} />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search orders..." 
                                                        className="form-control form-control-sm"
                                                        style={{ paddingLeft: '35px', width: '200px' }}
                                                    />
                                                </div>
                                                <Button variant="outline-secondary" size="sm">
                                                    <Filter size={14} className="me-1" />
                                                    Filter
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Table hover responsive className="align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Items</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>Time</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentOrders.map(order => (
                                                    <tr key={order._id}>
                                                        <td>
                                                            <span className="fw-semibold">#{order.orderId}</span>
                                                        </td>
                                                        <td>{order.customerName}</td>
                                                        <td>{order.items.length} items</td>
                                                        <td>₹{order.total}</td>
                                                        <td>{getStatusBadge(order.status)}</td>
                                                        <td>
                                                            <span className="text-muted small">
                                                                {new Date(order.createdAt).toLocaleTimeString()}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Button 
                                                                variant="link" 
                                                                size="sm"
                                                                onClick={() => navigate(`/staff/orders/${order._id}`)}
                                                                className="p-0"
                                                            >
                                                                <Eye size={18} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        
                                        {recentOrders.length === 0 && (
                                            <div className="text-center py-4">
                                                <Package size={40} className="text-muted mb-2" />
                                                <p className="text-muted mb-0">No recent orders found</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    
                    {/* Right Sidebar */}
                    <Col lg={4}>
                        {/* Inventory Alerts */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-white border-0 pt-4">
                                <h5 className="fw-semibold mb-0">Inventory Alerts</h5>
                            </Card.Header>
                            <Card.Body>
                                {stats.lowStockItems > 0 ? (
                                    <>
                                        <div className="bg-danger bg-opacity-10 p-3 rounded mb-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <AlertCircle className="text-danger" size={24} />
                                                <div>
                                                    <h6 className="fw-bold mb-1">{stats.lowStockItems} items low in stock</h6>
                                                    <p className="text-muted small mb-0">Restock soon to avoid running out</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            variant="warning" 
                                            className="w-100"
                                            onClick={() => navigate('/staff/inventory')}
                                        >
                                            View Inventory
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center py-3">
                                        <CheckCircle className="text-success mb-2" size={40} />
                                        <p className="text-muted mb-0">All items are well stocked</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                        
                        {/* Today's Summary */}
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 pt-4">
                                <h5 className="fw-semibold mb-0">Today's Summary</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Orders Received</span>
                                        <span className="fw-bold">{stats.pendingOrders}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Orders Completed</span>
                                        <span className="fw-bold">{stats.completedOrders}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Revenue Today</span>
                                        <span className="fw-bold text-success">₹{stats.todayRevenue || 0}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Average Order Value</span>
                                        <span className="fw-bold">₹{stats.avgOrderValue || 0}</span>
                                    </div>
                                </div>
                                
                                <hr />
                                
                                <Button 
                                    variant="outline-primary" 
                                    className="w-100"
                                    onClick={() => navigate('/staff/sales')}
                                >
                                    View Sales Report
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StaffDashboard;