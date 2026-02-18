import React, { useState, useEffect } from 'react';
import AppNavbar from '../../components/AppNavbar';
import { Button, Table, Card, Row, Col, Form, Badge, Container } from 'react-bootstrap';
import { Download, TrendingUp, DollarSign, Package, ShoppingBag } from 'lucide-react';
import API from '../../services/axios';
import { toast } from 'react-toastify';

const SalesReport = () => {

    const [sales, setSales] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    const loadSalesReport = async () => {
        try {
            setLoading(true);
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (category && category !== 'all') params.category = category;

            const res = await API.get('/sales', { params });
            setSales(res.data.sales);
            setMetrics(res.data.metrics);
            setTopProducts(res.data.topProducts);

            // Extract categories
            const uniqueCats = [...new Set(res.data.sales.flatMap(s =>
                s.items.map(i => i.product.category)
            ))];
            setCategories(uniqueCats);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load sales report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSalesReport();
    }, []);

    const exportCSV = async () => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            window.open(`http://localhost:5000/api/sales/csv?${new URLSearchParams(params)}`);
            toast.success('CSV downloaded');
        } catch (err) {
            toast.error('Failed to download CSV');
        }
    };

    const handleFilter = () => {
        loadSalesReport();
    };

    const styles = {
        container: {
            padding: '20px',
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
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            fontSize: '13px',
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
            marginBottom: '10px'
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
        }
    };

    return (
        <div>
            <AppNavbar />
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Sales Report</h1>
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
                        <Col md={3}>
                            <div style={styles.filterLabel}>Start Date</div>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={styles.input}
                            />
                        </Col>
                        <Col md={3}>
                            <div style={styles.filterLabel}>End Date</div>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={styles.input}
                            />
                        </Col>
                        <Col md={3}>
                            <div style={styles.filterLabel}>Category</div>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={styles.input}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <div style={styles.filterLabel}>&nbsp;</div>
                            <Button
                                variant="success"
                                onClick={handleFilter}
                                style={styles.button}
                                className="w-100"
                            >
                                Apply Filter
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Sales Table */}
                <div style={styles.tableContainer}>
                    <div style={styles.tableSection}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={styles.sectionTitle}>Order Details</h3>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={exportCSV}
                            >
                                <Download size={16} className="me-2" />
                                Export CSV
                            </Button>
                        </div>

                        {loading ? (
                            <div style={styles.emptyState}>Loading...</div>
                        ) : sales.length === 0 ? (
                            <div style={styles.emptyState}>No sales data found</div>
                        ) : (
                            <Table striped hover size="sm" responsive>
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) =>
                                        sale.items.map((item, idx) => (
                                            <tr key={`${sale._id}-${idx}`}>
                                                <td><Badge bg="success">{sale._id.toString().slice(-6)}</Badge></td>
                                                <td>{sale.customer?.name || 'N/A'}</td>
                                                <td>{item.product?.name}</td>
                                                <td>{item.product?.category}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{item.price?.toLocaleString()}</td>
                                                <td><strong>₹{(item.price * item.quantity).toLocaleString()}</strong></td>
                                                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                {topProducts.length > 0 && (
                    <div style={styles.tableContainer}>
                        <div style={styles.tableSection}>
                            <h3 style={styles.sectionTitle}>Top Products</h3>
                            <div style={styles.topProductsGrid}>
                                {topProducts.map((product, idx) => (
                                    <div key={idx} style={styles.productCard}>
                                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                        </div>
                                        <div style={styles.productName}>{product.productName}</div>
                                        <div style={styles.productStat}>Sold: <strong>{product.quantity}</strong> units</div>
                                        <div style={styles.productStat}>Revenue: <strong>₹{product.revenue?.toLocaleString()}</strong></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesReport;
