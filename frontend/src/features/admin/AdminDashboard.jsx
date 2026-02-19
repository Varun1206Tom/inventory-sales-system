import React, { useState } from 'react';
import { Container, Nav, Card } from 'react-bootstrap';
import AppNavbar from '../../components/AppNavbar';
import ProductManagement from './ProductManagement';
import StaffManagement from './StaffManagement';
import SalesReport from './SalesReport';
import OrderManagement from './OrderManagement';
import UsersReport from './UsersReport';

const AdminDashboard = () => {
    const [tab, setTab] = useState('products');

    const styles = {
        container: {
            padding: '15px 16px 24px 16px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: '#f8f9fa',
            minHeight: 'calc(100vh - 60px)'
        },
        headerCard: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '20px',
            // marginTop: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
        },
        titleSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        title: {
            fontSize: '22px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0,
            letterSpacing: '-0.3px'
        },
        badge: {
            backgroundColor: '#e9ecef',
            color: '#495057',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500'
        },
        navContainer: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '8px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            gap: '4px'
        },
        navItem: {
            flex: 1
        },
        navLink: (isActive) => ({
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isActive ? '#3498db' : 'transparent',
            color: isActive ? 'white' : '#495057',
            border: 'none',
            transition: 'all 0.2s ease',
            width: '100%',
            display: 'block',
            textDecoration: 'none'
        }),
        contentArea: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
            minHeight: '500px'
        },
        statsRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
        },
        statCard: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        statIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
        },
        statIconProducts: {
            backgroundColor: '#e8f4fd',
            color: '#3498db'
        },
        statIconStaff: {
            backgroundColor: '#e8f8f0',
            color: '#27ae60'
        },
        statIconSales: {
            backgroundColor: '#fef3e2',
            color: '#f39c12'
        },
        statContent: {
            flex: 1
        },
        statLabel: {
            fontSize: '12px',
            color: '#6c757d',
            marginBottom: '4px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
        },
        statValue: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0,
            lineHeight: 1.2
        },
        statSubtext: {
            fontSize: '11px',
            color: '#95a5a6',
            marginTop: '4px'
        },
        quickActionsCard: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            border: '1px dashed #dee2e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
        },
        quickActionsTitle: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        quickActionsButtons: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
        },
        quickButton: {
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            color: '#495057',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
        },
        footer: {
            marginTop: '20px',
            textAlign: 'center',
            padding: '16px',
            color: '#95a5a6',
            fontSize: '12px',
            borderTop: '1px solid #e9ecef'
        }
    };

    const stats = {
        products: 24,
        staff: 8,
        sales: '₹45,678'
    };

    return (
        <div>
            <AppNavbar />
            
            <div style={styles.container}>
                {/* Header Card with Title and Quick Stats */}
                <div style={styles.headerCard}>
                    <div style={styles.titleSection}>
                        <h1 style={styles.title}>Admin Dashboard</h1>
                        <span style={styles.badge}>Admin</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={styles.badge}>Last updated: Today</span>
                    </div>
                </div>

                {/* Stats Cards */}
                {/* <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, ...styles.statIconProducts}}>
                            📦
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>Total Products</div>
                            <div style={styles.statValue}>{stats.products}</div>
                            <div style={styles.statSubtext}>+3 this week</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, ...styles.statIconStaff}}>
                            👥
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>Staff Members</div>
                            <div style={styles.statValue}>{stats.staff}</div>
                            <div style={styles.statSubtext}>2 active now</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, ...styles.statIconSales}}>
                            📊
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>Today's Sales</div>
                            <div style={styles.statValue}>{stats.sales}</div>
                            <div style={styles.statSubtext}>↑ 12% from yesterday</div>
                        </div>
                    </div>
                </div> */}

                {/* Quick Actions Bar */}
                <div style={styles.quickActionsCard}>
                    <div style={styles.quickActionsTitle}>
                        <span>⚡</span> Quick Actions
                    </div>
                    <div style={styles.quickActionsButtons}>
                        <button 
                            style={styles.quickButton}
                            onClick={() => setTab('products')}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            + Add Product
                        </button>
                        <button 
                            style={styles.quickButton}
                            onClick={() => setTab('staff')}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            + Add Staff
                        </button>
                        <button 
                            style={styles.quickButton}
                            onClick={() => setTab('sales')}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            View Reports
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={styles.navContainer}>
                    <div style={styles.navItem}>
                        <div 
                            style={styles.navLink(tab === 'products')}
                            onClick={() => setTab('products')}
                            onMouseOver={(e) => {
                                if (tab !== 'products') {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (tab !== 'products') {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            📦 Products
                        </div>
                    </div>
                    <div style={styles.navItem}>
                        <div 
                            style={styles.navLink(tab === 'staff')}
                            onClick={() => setTab('staff')}
                            onMouseOver={(e) => {
                                if (tab !== 'staff') {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (tab !== 'staff') {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            👥 Staff
                        </div>
                    </div>
                    <div style={styles.navItem}>
                        <div 
                            style={styles.navLink(tab === 'sales')}
                            onClick={() => setTab('sales')}
                            onMouseOver={(e) => {
                                if (tab !== 'sales') {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (tab !== 'sales') {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            📈 Sales
                        </div>
                    </div>
                    <div style={styles.navItem}>
                        <div 
                            style={styles.navLink(tab === 'orders')}
                            onClick={() => setTab('orders')}
                            onMouseOver={(e) => {
                                if (tab !== 'orders') {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (tab !== 'orders') {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            📦 Orders
                        </div>
                    </div>
                    <div style={styles.navItem}>
                        <div 
                            style={styles.navLink(tab === 'users')}
                            onClick={() => setTab('users')}
                            onMouseOver={(e) => {
                                if (tab !== 'users') {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (tab !== 'users') {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            👤 Users
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div style={styles.contentArea}>
                    {tab === 'products' && <ProductManagement />}
                    {tab === 'staff' && <StaffManagement />}
                    {tab === 'sales' && <SalesReport />}
                    {tab === 'orders' && <OrderManagement />}
                    {tab === 'users' && <UsersReport />}
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    Admin Dashboard v1.0 • Manage your products, staff, and sales
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;