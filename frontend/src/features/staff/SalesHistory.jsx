import React, { useState, useEffect } from 'react';
import AppNavbar from '../../components/AppNavbar';
import { Button, Table, Row, Col, Form, Container, Badge } from 'react-bootstrap';
import { 
    Download, 
    TrendingUp, 
    DollarSign, 
    Package, 
    ShoppingBag,
    Calendar,
    Filter,
    RefreshCw
} from 'lucide-react';
import API from '../../services/axios';
import { toast } from 'react-toastify';

const SalesHistory = () => {
    const [sales, setSales] = useState({});
    const [metrics, setMetrics] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeframe, setTimeframe] = useState('daily');
    const [expandedPeriod, setExpandedPeriod] = useState(null);
    const token = localStorage.getItem('token');

    const loadSalesHistory = async () => {
        try {
            setLoading(true);
            const params = {
                timeframe: timeframe
            };
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await API.get('/sales/history/all', { 
                params,
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(res.data.sales || {});
            setMetrics(res.data.metrics || {});
            setTopProducts(res.data.topProducts || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load sales history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSalesHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = () => {
        loadSalesHistory();
    };

    const handleRefresh = () => {
        loadSalesHistory();
    };

    const exportCSV = async () => {
        try {
            const params = {
                timeframe: timeframe
            };
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const queryString = new URLSearchParams(params).toString();
            window.open(`http://localhost:5000/api/sales/history/csv?${queryString}`, '_blank');
            toast.success('CSV downloaded successfully');
        } catch (err) {
            toast.error('Failed to download CSV');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'completed': { bg: '#d4edda', color: '#155724', text: 'Completed' },
            'pending': { bg: '#fff3cd', color: '#856404', text: 'Pending' },
            'processing': { bg: '#cce5ff', color: '#004085', text: 'Processing' },
            'cancelled': { bg: '#f8d7da', color: '#721c24', text: 'Cancelled' }
        };
        const config = statusConfig[status] || statusConfig.completed;
        return (
            <Badge style={{ backgroundColor: config.bg, color: config.color }}>
                {config.text}
            </Badge>
        );
    };

    const styles = {
        container: {
            padding: '24px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        },
        header: {
            marginBottom: '30px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '5px'
        },
        subtitle: {
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '0'
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        metricCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #28a745'
        },
        metricIcon: {
            marginBottom: '10px',
            color: '#28a745'
        },
        metricLabel: {
            fontSize: '12px',
            color: '#6c757d',
            marginBottom: '8px',
            textTransform: 'uppercase',
            fontWeight: '600'
        },
        metricValue: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50'
        },
        filterSection: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        filterLabel: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#495057',
            marginBottom: '6px'
        },
        input: {
            borderRadius: '4px',
            border: '1px solid #dee2e6',
            padding: '8px 12px',
            fontSize: '13px'
        },
        button: {
            height: '38px'
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
        },
        tableSection: {
            padding: '20px'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '15px'
        },
        periodHeader: {
            backgroundColor: '#f8f9fa',
            padding: '12px 0',
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6',
            fontWeight: '600',
            color: '#495057',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        periodTable: {
            marginBottom: '15px'
        },
        topProductsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            borderTop: '4px solid #28a745'
        },
        productName: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '10px',
            wordBreak: 'break-word'
        },
        productStat: {
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '5px'
        },
        emptyState: {
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6c757d'
        },
        badgeContainer: {
            display: 'inline-block'
        }
    };

    return (
        <div>
            <AppNavbar />
            <Container fluid style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Sales History</h1>
                    <p style={styles.subtitle}>View and download sales records by daily, weekly, or monthly periods</p>
                </div>

                {/* Metrics */}
                {metrics && (
                    <div style={styles.metricsGrid}>
                        <div style={styles.metricCard}>
                            <div style={styles.metricIcon}><DollarSign size={24} /></div>
                            <div style={styles.metricLabel}>Total Revenue</div>
                            <div style={styles.metricValue}>₹{metrics.totalRevenue?.toLocaleString() || 0}</div>
                        </div>

                        <div style={styles.metricCard}>
                            <div style={styles.metricIcon}><ShoppingBag size={24} /></div>
                            <div style={styles.metricLabel}>Total Orders</div>
                            <div style={styles.metricValue}>{metrics.totalOrders || 0}</div>
                        </div>

                        <div style={styles.metricCard}>
                            <div style={styles.metricIcon}><Package size={24} /></div>
                            <div style={styles.metricLabel}>Items Sold</div>
                            <div style={styles.metricValue}>{metrics.totalItems || 0}</div>
                        </div>

                        <div style={styles.metricCard}>
                            <div style={styles.metricIcon}><TrendingUp size={24} /></div>
                            <div style={styles.metricLabel}>Avg Order Value</div>
                            <div style={styles.metricValue}>₹{metrics.averageOrderValue?.toFixed(0).toLocaleString() || 0}</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={styles.filterSection}>
                    <Row>
                        <Col md={2}>
                            <div style={styles.filterLabel}>Timeframe</div>
                            <Form.Select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                style={styles.input}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <div style={styles.filterLabel}>Start Date</div>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={styles.input}
                            />
                        </Col>
                        <Col md={2}>
                            <div style={styles.filterLabel}>End Date</div>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={styles.input}
                            />
                        </Col>
                        <Col md={3}>
                            <div style={styles.filterLabel}>&nbsp;</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button
                                    variant="success"
                                    onClick={handleFilter}
                                    style={styles.button}
                                    className="w-100"
                                >
                                    <Filter size={16} className="me-2" />
                                    Apply Filter
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleRefresh}
                                    style={styles.button}
                                >
                                    <RefreshCw size={16} />
                                </Button>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div style={styles.filterLabel}>&nbsp;</div>
                            <Button
                                variant="success"
                                onClick={exportCSV}
                                className="w-100"
                                style={styles.button}
                            >
                                <Download size={16} className="me-2" />
                                Export to CSV
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Sales History by Period */}
                <div style={styles.tableContainer}>
                    <div style={styles.tableSection}>
                        <h3 style={styles.sectionTitle}>
                            <Calendar size={20} className="me-2" style={{ marginRight: '10px' }} />
                            Sales by {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                        </h3>

                        {loading ? (
                            <div style={styles.emptyState}>Loading sales history...</div>
                        ) : Object.keys(sales).length === 0 ? (
                            <div style={styles.emptyState}>No sales data found for the selected period</div>
                        ) : (
                            Object.entries(sales).map(([period, periodSales]) => (
                                <div key={period} style={styles.periodTable}>
                                    <div 
                                        style={styles.periodHeader}
                                        onClick={() => setExpandedPeriod(expandedPeriod === period ? null : period)}
                                    >
                                        <span>{period} ({periodSales.length} orders)</span>
                                        <span style={{ fontSize: '12px' }}>
                                            {expandedPeriod === period ? '▼' : '▶'}
                                        </span>
                                    </div>
                                    
                                    {expandedPeriod === period && (
                                        <Table striped hover size="sm" responsive style={{ marginBottom: '0', marginTop: '10px' }}>
                                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Product</th>
                                                    <th>Category</th>
                                                    <th>Qty</th>
                                                    <th>Unit Price</th>
                                                    <th>Line Total</th>
                                                    <th>Order Total</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {periodSales.map((sale) =>
                                                    sale.items.map((item, idx) => (
                                                        <tr key={`${sale._id}-${idx}`}>
                                                            <td><strong>#{sale._id.toString().slice(-6)}</strong></td>
                                                            <td>{sale.customer?.name}</td>
                                                            <td>{item.product?.name}</td>
                                                            <td>{item.product?.category}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>₹{item.price?.toFixed(2)}</td>
                                                            <td>₹{(item.price * item.quantity)?.toFixed(2)}</td>
                                                            <td><strong>₹{sale.totalAmount?.toFixed(2)}</strong></td>
                                                            <td style={styles.badgeContainer}>
                                                                {getStatusBadge(sale.status)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Products */}
                {topProducts.length > 0 && (
                    <div style={styles.tableContainer}>
                        <div style={styles.tableSection}>
                            <h3 style={styles.sectionTitle}>Top 10 Products</h3>
                            <div style={styles.topProductsGrid}>
                                {topProducts.map((product, idx) => (
                                    <div key={idx} style={styles.productCard}>
                                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                        </div>
                                        <div style={styles.productName}>{product.productName}</div>
                                        <div style={styles.productStat}>Category: {product.category}</div>
                                        <div style={styles.productStat}>
                                            Quantity Sold: <strong>{product.quantity}</strong>
                                        </div>
                                        <div style={styles.productStat}>
                                            Revenue: <strong>₹{product.revenue?.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SalesHistory;
