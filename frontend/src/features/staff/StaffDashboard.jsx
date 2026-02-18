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
    AlertCircle,
    ArrowRight,
    Calendar,
    Truck,
    Box,
    BarChart3,
    PieChart,
    Activity,
    Zap,
    Layers,
    Grid,
    List,
    Heart,
    ShoppingCart,
    User,
    Settings,
    Bell,
    LogOut,
    Menu,
    Star,
    Award,
    Shield,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    Globe,
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    Wind,
    Droplets
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
        lowStockItems: 0,
        todayRevenue: 0,
        avgOrderValue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('today');
    const [weather, setWeather] = useState({
        temp: 25,
        condition: 'Clear',
        humidity: 65
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDashboardData();
    }, [timeframe]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch stats from API
            const statsRes = await API.get('/staff/stats', {
                params: { timeframe },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);

            // Fetch recent orders from API
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
            'pending': { bg: '#fff3e0', color: '#f57c00', text: 'Pending', icon: Clock },
            'processing': { bg: '#e3f2fd', color: '#1976d2', text: 'Processing', icon: RefreshCw },
            'completed': { bg: '#e8f5e9', color: '#2e7d32', text: 'Completed', icon: CheckCircle },
            'cancelled': { bg: '#ffebee', color: '#d32f2f', text: 'Cancelled', icon: XCircle }
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <span style={{
                backgroundColor: config.bg,
                color: config.color,
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                <Icon size={12} />
                {config.text}
            </span>
        );
    };

    // Styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: '#f8f9fa'
        },
        content: {
            padding: '24px'
        },
        header: {
            marginBottom: '24px'
        },
        pageTitle: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '4px'
        },
        pageSubtitle: {
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '16px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
            marginBottom: '24px'
        },
        statCard: {
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e9ecef'
        },
        statIcon: (color) => ({
            background: `${color}10`,
            color: color,
            padding: '8px',
            borderRadius: '6px',
            display: 'inline-flex',
            marginBottom: '12px'
        }),
        statValue: {
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '12px',
            color: '#6c757d'
        },
        mainGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '24px'
        },
        leftColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        quickActionsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
        },
        actionCard: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            padding: '20px'
        },
        actionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '16px'
        },
        actionTitle: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '4px'
        },
        actionDesc: {
            fontSize: '12px',
            color: '#6c757d'
        },
        actionIcon: (color, bg) => ({
            background: bg,
            color: color,
            padding: '10px',
            borderRadius: '8px'
        }),
        progressSection: {
            marginTop: '16px'
        },
        progressItem: {
            marginBottom: '12px'
        },
        progressHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
        },
        progressLabel: {
            fontSize: '12px',
            color: '#6c757d'
        },
        progressValue: {
            fontSize: '12px',
            fontWeight: '500'
        },
        progressBar: {
            height: '6px',
            background: '#e9ecef',
            borderRadius: '3px',
            overflow: 'hidden'
        },
        progressFill: (color, width) => ({
            height: '100%',
            width: `${width}%`,
            background: color,
            borderRadius: '3px'
        }),
        salesCard: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            padding: '20px'
        },
        salesAmount: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#2e7d32'
        },
        statsRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '20px'
        },
        miniStat: {
            textAlign: 'center'
        },
        miniStatValue: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '2px'
        },
        miniStatLabel: {
            fontSize: '11px',
            color: '#6c757d'
        },
        tableContainer: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            overflow: 'hidden'
        },
        tableHeader: {
            padding: '16px 20px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        tableTitle: {
            fontSize: '16px',
            fontWeight: '600',
            margin: 0
        },
        searchBox: {
            position: 'relative',
            width: '220px'
        },
        searchInput: {
            width: '100%',
            padding: '6px 12px 6px 32px',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '13px'
        },
        searchIcon: {
            position: 'absolute',
            left: '10px',
            top: '8px',
            color: '#adb5bd',
            width: '14px',
            height: '14px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            textAlign: 'left',
            padding: '12px 20px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#6c757d',
            borderBottom: '1px solid #e9ecef',
            background: '#f8f9fa'
        },
        td: {
            padding: '12px 20px',
            fontSize: '13px',
            borderBottom: '1px solid #e9ecef'
        },
        orderId: {
            fontFamily: 'monospace',
            fontWeight: '500',
            color: '#495057'
        },
        customerName: {
            fontWeight: '500'
        },
        amount: {
            fontWeight: '600',
            color: '#2e7d32'
        },
        viewBtn: {
            color: '#6c757d',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px'
        },
        rightColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        alertCard: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            padding: '20px'
        },
        alertTitle: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px'
        },
        alertBox: {
            background: '#fff3e0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        alertIcon: {
            color: '#f57c00',
            width: '24px',
            height: '24px'
        },
        alertContent: {
            flex: 1
        },
        alertHeading: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '2px'
        },
        alertText: {
            fontSize: '12px',
            color: '#6c757d'
        },
        summaryCard: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            padding: '20px'
        },
        summaryTitle: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px'
        },
        summaryItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
        },
        summaryLabel: {
            fontSize: '13px',
            color: '#6c757d'
        },
        summaryValue: {
            fontSize: '13px',
            fontWeight: '600'
        },
        weatherCard: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            padding: '20px'
        },
        weatherTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        weatherDisplay: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        weatherTemp: {
            fontSize: '24px',
            fontWeight: '600'
        },
        weatherDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        weatherDetail: {
            fontSize: '12px',
            color: '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        button: {
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s'
        },
        primaryButton: {
            background: '#0d6efd',
            color: 'white',
            width: '100%'
        },
        successButton: {
            background: '#198754',
            color: 'white',
            width: '100%'
        },
        outlineButton: {
            background: 'transparent',
            border: '1px solid #0d6efd',
            color: '#0d6efd'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Navbar />
            
            <div style={styles.content}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.pageTitle}>Staff Dashboard</h1>
                    <p style={styles.pageSubtitle}>Welcome back! Here's what's happening today.</p>
                    
                    {/* Timeframe Tabs */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            style={{
                                ...styles.button,
                                background: timeframe === 'today' ? '#0d6efd' : 'white',
                                color: timeframe === 'today' ? 'white' : '#6c757d',
                                border: '1px solid #dee2e6'
                            }}
                            onClick={() => setTimeframe('today')}
                        >
                            Today
                        </button>
                        <button 
                            style={{
                                ...styles.button,
                                background: timeframe === 'week' ? '#0d6efd' : 'white',
                                color: timeframe === 'week' ? 'white' : '#6c757d',
                                border: '1px solid #dee2e6'
                            }}
                            onClick={() => setTimeframe('week')}
                        >
                            This Week
                        </button>
                        <button 
                            style={{
                                ...styles.button,
                                background: timeframe === 'month' ? '#0d6efd' : 'white',
                                color: timeframe === 'month' ? 'white' : '#6c757d',
                                border: '1px solid #dee2e6'
                            }}
                            onClick={() => setTimeframe('month')}
                        >
                            This Month
                        </button>
                        <button 
                            style={{
                                ...styles.button,
                                background: 'white',
                                color: '#6c757d',
                                border: '1px solid #dee2e6',
                                marginLeft: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onClick={fetchDashboardData}
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#f57c00')}>
                            <Clock size={20} />
                        </div>
                        <div style={styles.statValue}>{stats.pendingOrders}</div>
                        <div style={styles.statLabel}>Pending Orders</div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#0d6efd')}>
                            <RefreshCw size={20} />
                        </div>
                        <div style={styles.statValue}>{stats.processingOrders}</div>
                        <div style={styles.statLabel}>Processing</div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#198754')}>
                            <CheckCircle size={20} />
                        </div>
                        <div style={styles.statValue}>{stats.completedOrders}</div>
                        <div style={styles.statLabel}>Completed</div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#0d6efd')}>
                            <DollarSign size={20} />
                        </div>
                        <div style={styles.statValue}>₹{stats.totalSales?.toLocaleString() || 0}</div>
                        <div style={styles.statLabel}>Total Sales</div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#6f42c1')}>
                            <Users size={20} />
                        </div>
                        <div style={styles.statValue}>{stats.totalCustomers}</div>
                        <div style={styles.statLabel}>Customers</div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statIcon('#dc3545')}>
                            <AlertCircle size={20} />
                        </div>
                        <div style={styles.statValue}>{stats.lowStockItems}</div>
                        <div style={styles.statLabel}>Low Stock</div>
                    </div>
                </div>

                {/* Main Grid - Two Column Layout */}
                <div style={styles.mainGrid}>
                    {/* Left Column */}
                    <div style={styles.leftColumn}>
                        {/* Quick Actions */}
                        <div style={styles.quickActionsGrid}>
                            {/* Process Orders Card */}
                            <div style={styles.actionCard}>
                                <div style={styles.actionHeader}>
                                    <div>
                                        <h3 style={styles.actionTitle}>Process Orders</h3>
                                        <p style={styles.actionDesc}>Manage pending and active orders</p>
                                    </div>
                                    <div style={styles.actionIcon('#0d6efd', '#e3f2fd')}>
                                        <Package size={20} />
                                    </div>
                                </div>
                                
                                <div style={styles.progressSection}>
                                    <div style={styles.progressItem}>
                                        <div style={styles.progressHeader}>
                                            <span style={styles.progressLabel}>Pending Orders</span>
                                            <span style={styles.progressValue}>{stats.pendingOrders}</span>
                                        </div>
                                        <div style={styles.progressBar}>
                                            <div style={styles.progressFill('#f57c00', (stats.pendingOrders / (stats.pendingOrders + stats.processingOrders + stats.completedOrders || 1)) * 100)} />
                                        </div>
                                    </div>
                                    
                                    <div style={styles.progressItem}>
                                        <div style={styles.progressHeader}>
                                            <span style={styles.progressLabel}>Processing</span>
                                            <span style={styles.progressValue}>{stats.processingOrders}</span>
                                        </div>
                                        <div style={styles.progressBar}>
                                            <div style={styles.progressFill('#0d6efd', (stats.processingOrders / (stats.pendingOrders + stats.processingOrders + stats.completedOrders || 1)) * 100)} />
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    style={{...styles.button, ...styles.primaryButton, marginTop: '16px'}}
                                    onClick={() => navigate('/staff/orders')}
                                >
                                    View All Orders
                                </button>
                            </div>
                            
                            {/* Record Sales Card */}
                            <div style={styles.actionCard}>
                                <div style={styles.actionHeader}>
                                    <div>
                                        <h3 style={styles.actionTitle}>Record Sales</h3>
                                        <p style={styles.actionDesc}>Process new sales and payments</p>
                                    </div>
                                    <div style={styles.actionIcon('#198754', '#e8f5e9')}>
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                                
                                <div style={styles.salesCard}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <div style={styles.salesAmount}>₹{stats.totalSales?.toLocaleString() || 0}</div>
                                        <p style={styles.progressLabel}>Total Sales ({timeframe})</p>
                                    </div>
                                    
                                    <div style={styles.statsRow}>
                                        <div style={styles.miniStat}>
                                            <div style={styles.miniStatValue}>{stats.completedOrders}</div>
                                            <div style={styles.miniStatLabel}>Completed</div>
                                        </div>
                                        <div style={styles.miniStat}>
                                            <div style={styles.miniStatValue}>{stats.pendingOrders}</div>
                                            <div style={styles.miniStatLabel}>Pending</div>
                                        </div>
                                        <div style={styles.miniStat}>
                                            <div style={styles.miniStatValue}>{stats.lowStockItems}</div>
                                            <div style={styles.miniStatLabel}>Low Stock</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    style={{...styles.button, ...styles.successButton, marginTop: '16px'}}
                                    onClick={() => navigate('/staff/sales/new')}
                                >
                                    New Sale
                                </button>
                            </div>
                        </div>
                        
                        {/* Recent Orders Table */}
                        <div style={styles.tableContainer}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Recent Orders</h3>
                                <div style={styles.searchBox}>
                                    <Search style={styles.searchIcon} />
                                    <input 
                                        type="text" 
                                        placeholder="Search orders..." 
                                        style={styles.searchInput}
                                    />
                                </div>
                            </div>
                            
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Order ID</th>
                                        <th style={styles.th}>Customer</th>
                                        <th style={styles.th}>Items</th>
                                        <th style={styles.th}>Total</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td style={styles.td}>
                                                <span style={styles.orderId}>#{order.orderId}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.customerName}>{order.customerName}</span>
                                            </td>
                                            <td style={styles.td}>{order.items?.length || 0} items</td>
                                            <td style={styles.td}>
                                                <span style={styles.amount}>₹{order.total?.toLocaleString() || 0}</span>
                                            </td>
                                            <td style={styles.td}>{getStatusBadge(order.status)}</td>
                                            <td style={styles.td}>
                                                <button 
                                                    style={styles.viewBtn}
                                                    onClick={() => navigate(`/staff/orders/${order._id}`)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {recentOrders.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <Package size={40} color="#adb5bd" style={{ marginBottom: '12px' }} />
                                    <p style={{ color: '#6c757d', marginBottom: 0 }}>No recent orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div style={styles.rightColumn}>
                        {/* Inventory Alerts */}
                        <div style={styles.alertCard}>
                            <h3 style={styles.alertTitle}>Inventory Alerts</h3>
                            
                            {stats.lowStockItems > 0 ? (
                                <>
                                    <div style={styles.alertBox}>
                                        <AlertCircle style={styles.alertIcon} />
                                        <div style={styles.alertContent}>
                                            <h4 style={styles.alertHeading}>{stats.lowStockItems} items low in stock</h4>
                                            <p style={styles.alertText}>Restock soon to avoid running out</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        style={{...styles.button, ...styles.primaryButton}}
                                        onClick={() => navigate('/staff/inventory')}
                                    >
                                        View Inventory
                                    </button>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <CheckCircle size={40} color="#198754" style={{ marginBottom: '12px' }} />
                                    <p style={{ color: '#6c757d', marginBottom: 0 }}>All items are well stocked</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Today's Summary */}
                        <div style={styles.summaryCard}>
                            <h3 style={styles.summaryTitle}>Today's Summary</h3>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Orders Received</span>
                                <span style={styles.summaryValue}>{stats.pendingOrders}</span>
                            </div>
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Orders Completed</span>
                                <span style={styles.summaryValue}>{stats.completedOrders}</span>
                            </div>
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Revenue Today</span>
                                <span style={{...styles.summaryValue, color: '#198754'}}>₹{stats.todayRevenue?.toLocaleString() || 0}</span>
                            </div>
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Average Order Value</span>
                                <span style={styles.summaryValue}>₹{stats.avgOrderValue?.toLocaleString() || 0}</span>
                            </div>
                            
                            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e9ecef' }} />
                            
                            <button 
                                style={{...styles.button, ...styles.outlineButton, width: '100%'}}
                                onClick={() => navigate('/staff/sales')}
                            >
                                View Sales Report
                            </button>
                        </div>
                        
                        {/* Weather Widget */}
                        <div style={styles.weatherCard}>
                            <h4 style={styles.weatherTitle}>
                                <Sun size={16} color="#f57c00" />
                                Weather
                            </h4>
                            
                            <div style={styles.weatherDisplay}>
                                <div style={styles.weatherTemp}>{weather.temp}°C</div>
                                <div style={styles.weatherDetails}>
                                    <div style={styles.weatherDetail}>
                                        <Sun size={12} />
                                        {weather.condition}
                                    </div>
                                    <div style={styles.weatherDetail}>
                                        <Droplets size={12} />
                                        Humidity: {weather.humidity}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;