import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../services/axios';
import { Spinner } from 'react-bootstrap';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('customer');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });

    // Demo credentials for quick access (admin matches backend hardcoded admin)
    const demoAccounts = {
        customer: { email: 'john@example.com', password: '123456' },
        staff: { email: 'staff@example.com', password: '123456' },
        admin: { email: 'admin@gmail.com', password: 'admin' }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast.warning("Please enter email & password");
            return;
        }

        if (!isLogin && !form.name) {
            toast.warning("Please enter your name");
            return;
        }

        try {
            setLoading(true);

            if (isLogin) {
                const res = await API.post('/auth/login', {
                    email: form.email.trim(),
                    password: form.password.trim()
                });

                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                const role = res.data.user.role;
                toast.success(`Welcome back!`);

                // Cart merge for customers: merge guest cart (localStorage) into server cart with stock validation
                if (role === 'customer') {
                    try {
                        const savedCart = localStorage.getItem('cart');
                        if (savedCart) {
                            const parsed = JSON.parse(savedCart);
                            const items = Array.isArray(parsed) ? parsed : (parsed?.items || []);
                            if (items.length > 0) {
                                const toMerge = items.map((i) => ({
                                    productId: typeof i.product === 'object' ? i.product?._id : i.product,
                                    quantity: i.quantity || 1
                                })).filter((i) => i.productId);
                                if (toMerge.length > 0) {
                                    const mergeRes = await API.post('/cart/merge', { items: toMerge });
                                    if (mergeRes.data.skipped?.length) {
                                        toast.info(`Cart merged. Some items were limited by stock.`);
                                    } else {
                                        toast.info(`Cart merged with ${mergeRes.data.merged || toMerge.length} item(s).`);
                                    }
                                    localStorage.removeItem('cart');
                                }
                            }
                        }

                        // Wishlist merge: merge localStorage wishlist to backend (backward compatibility)
                        const savedWishlist = localStorage.getItem('wishlist');
                        if (savedWishlist) {
                            try {
                                const parsed = JSON.parse(savedWishlist);
                                const products = Array.isArray(parsed) ? parsed : [];
                                if (products.length > 0) {
                                    const productIds = products
                                        .map(p => typeof p === 'object' ? p?._id : p)
                                        .filter(Boolean);
                                    
                                    // Add each product to backend wishlist (API handles duplicates)
                                    let merged = 0;
                                    for (const productId of productIds) {
                                        try {
                                            await API.post('/wishlist/add', { productId });
                                            merged++;
                                        } catch (err) {
                                            // Ignore "already in wishlist" errors
                                            if (err.response?.status !== 400) {
                                                console.warn('Failed to merge wishlist item:', err);
                                            }
                                        }
                                    }
                                    if (merged > 0) {
                                        localStorage.removeItem('wishlist');
                                    }
                                }
                            } catch (wishlistErr) {
                                console.warn('Wishlist merge failed:', wishlistErr);
                            }
                        }
                    } catch (mergeErr) {
                        console.warn('Cart merge failed:', mergeErr);
                    }
                }

                // Redirect based on role
                if (role === 'admin') navigate('/admin');
                else if (role === 'staff') navigate('/staff');
                else navigate('/');
            } else {
                // Only allow customer registration
                await API.post('/auth/register', {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password.trim(),
                    role: 'customer' // Force role to customer for registration
                });

                toast.success("Registration successful! Please login.");
                setIsLogin(true);
                setForm({ name: '', email: '', password: '', role: 'customer' });
                setSelectedRole('customer');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || (isLogin ? "Invalid Credentials" : "Registration Failed"));
        } finally {
            setLoading(false);
        }
    };

    const quickAccess = (role) => {
        const account = demoAccounts[role];
        setForm({ ...form, email: account.email, password: account.password });
        setSelectedRole(role);

        // Auto submit
        setTimeout(() => {
            const form = document.getElementById('login-form');
            const event = new Event('submit', { cancelable: true, bubbles: true });
            form.dispatchEvent(event);
        }, 100);
    };

    // Compact styles
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        card: {
            display: 'flex',
            maxWidth: '1000px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        },
        leftPanel: {
            flex: '1',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        },
        rightPanel: {
            flex: '1.2',
            padding: '32px',
            backgroundColor: 'white'
        },
        brandName: {
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '4px',
        },
        brandSub: {
            fontSize: '12px',
            opacity: '0.9',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
        },
        roleCards: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '24px'
        },
        roleCard: (isActive, roleColor, isDisabled = false) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '12px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            border: isActive ? `2px solid ${roleColor}` : '2px solid transparent',
            opacity: isDisabled ? 0.6 : 1
        }),
        roleIcon: {
            fontSize: '20px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
        },
        roleInfo: {
            flex: 1
        },
        roleTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '2px'
        },
        roleDesc: {
            fontSize: '11px',
            opacity: '0.8'
        },
        badge: {
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            marginLeft: '8px'
        },
        featureSection: {
            flex: 1
        },
        featureTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        featureList: {
            listStyle: 'none',
            padding: 0,
            margin: 0
        },
        featureItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontSize: '12px',
            padding: '6px 10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '6px'
        },
        demoSection: {
            marginTop: '20px',
            padding: '12px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '10px'
        },
        demoTitle: {
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        demoButtons: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px'
        },
        demoButton: (roleColor) => ({
            padding: '6px',
            fontSize: '10px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            borderLeft: `2px solid ${roleColor}`,
            transition: 'all 0.2s'
        }),
        title: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '4px'
        },
        subtitle: {
            fontSize: '13px',
            color: '#718096',
            marginBottom: '20px'
        },
        registrationNotice: {
            padding: '10px',
            backgroundColor: '#f0fff4',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#276749',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #9ae6b4'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        label: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#4a5568'
        },
        input: {
            padding: '10px 12px',
            fontSize: '13px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: '#f7fafc'
        },
        button: (loading, roleColor) => ({
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: roleColor,
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
        }),
        toggleText: {
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '12px',
            color: '#718096'
        },
        toggleLink: (roleColor) => ({
            color: roleColor,
            fontWeight: '600',
            cursor: 'pointer',
            marginLeft: '4px'
        }),
        infoBox: {
            marginTop: '16px',
            padding: '10px',
            backgroundColor: '#ebf8ff',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#2c5282',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        footer: {
            marginTop: '12px',
            fontSize: '10px',
            color: '#a0aec0',
            textAlign: 'center'
        }
    };

    // Role-based colors
    const roleColors = {
        customer: '#48bb78',
        staff: '#f6ad55',
        admin: '#f56565'
    };

    // Role-based features
    const roleFeatures = {
        customer: [
            'Browse products',
            'Place orders',
            'Track orders',
            'View history'
        ],
        staff: [
            'Process orders',
            'Manage stock',
            'Update inventory',
            'View reports'
        ],
        admin: [
            'Full access',
            'Manage users',
            'All reports',
            'Monitor system'
        ]
    };

    // Role icons
    const roleIcons = {
        customer: '🛍️',
        staff: '👥',
        admin: '👑'
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Left Panel */}
                <div style={styles.leftPanel}>
                    <div>
                        <div style={styles.brandName}>Inventory & Sales Management</div>
                        <div style={styles.brandSub}>Complete management system</div>
                    </div>

                    {/* Role Cards */}
                    <div style={styles.roleCards}>
                        {/* Customer - Always selectable */}
                        <div
                            style={styles.roleCard(selectedRole === 'customer', roleColors.customer)}
                            onClick={() => {
                                setSelectedRole('customer');
                                if (!isLogin) setIsLogin(true); // Switch to login if trying to register as customer (though customer can register)
                            }}
                        >
                            <span style={styles.roleIcon}>{roleIcons.customer}</span>
                            <div style={styles.roleInfo}>
                                <div style={styles.roleTitle}>
                                    Customer
                                    {!isLogin && selectedRole === 'customer' && (
                                        <span style={styles.badge}>Register</span>
                                    )}
                                </div>
                                <div style={styles.roleDesc}>Browse & shop</div>
                            </div>
                        </div>

                        {/* Staff - Login only, no registration */}
                        <div
                            style={styles.roleCard(selectedRole === 'staff', roleColors.staff, !isLogin)}
                            onClick={() => {
                                if (isLogin) {
                                    setSelectedRole('staff');
                                } else {
                                    toast.info("Staff accounts can only be created by admin");
                                }
                            }}
                        >
                            <span style={styles.roleIcon}>{roleIcons.staff}</span>
                            <div style={styles.roleInfo}>
                                <div style={styles.roleTitle}>
                                    Staff
                                    {!isLogin && (
                                        <span style={styles.badge}>Login only</span>
                                    )}
                                </div>
                                <div style={styles.roleDesc}>Manage orders</div>
                            </div>
                        </div>

                        {/* Admin - Login only, no registration */}
                        <div
                            style={styles.roleCard(selectedRole === 'admin', roleColors.admin, !isLogin)}
                            onClick={() => {
                                if (isLogin) {
                                    setSelectedRole('admin');
                                } else {
                                    toast.info("Admin accounts can only be created by super admin");
                                }
                            }}
                        >
                            <span style={styles.roleIcon}>{roleIcons.admin}</span>
                            <div style={styles.roleInfo}>
                                <div style={styles.roleTitle}>
                                    Admin
                                    {!isLogin && (
                                        <span style={styles.badge}>Login only</span>
                                    )}
                                </div>
                                <div style={styles.roleDesc}>Full control</div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div style={styles.featureSection}>
                        <div style={styles.featureTitle}>
                            <span>{roleIcons[selectedRole]}</span>
                            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Features
                        </div>
                        <ul style={styles.featureList}>
                            {roleFeatures[selectedRole].map((feature, index) => (
                                <li key={index} style={styles.featureItem}>
                                    <span style={{ color: roleColors[selectedRole] }}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Panel - Auth Form */}
                {/* Right Panel - Auth Form */}
                <div style={styles.rightPanel}>
                    <h2 style={styles.title}>
                        {isLogin ? 'Welcome!' : 'Create Customer Account'}
                    </h2>
                    <p style={styles.subtitle}>
                        {isLogin
                            ? `Sign in as ${selectedRole}`
                            : 'Register to start shopping'
                        }
                    </p>

                    {/* Enhanced Browse Products Option */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '24px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative accent line */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            background: `linear-gradient(180deg, ${roleColors[selectedRole]} 0%, ${roleColors[selectedRole]}80 100%)`,
                            borderRadius: '4px 0 0 4px'
                        }} />

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginLeft: '8px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                            }}>
                                🛍️
                            </span>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{
                                    color: '#1e293b',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    Not ready to login?
                                </span>
                                <span style={{
                                    color: '#64748b',
                                    fontSize: '12px'
                                }}>
                                    Explore our products first
                                </span>
                            </div>
                        </div>

                        <a
                            onClick={() => navigate('/')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                background: 'white',
                                color: roleColors[selectedRole],
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                borderRadius: '8px',
                                border: `1px solid ${roleColors[selectedRole]}30`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateX(4px)';
                                e.target.style.background = roleColors[selectedRole];
                                e.target.style.color = 'white';
                                e.target.style.boxShadow = `0 4px 8px ${roleColors[selectedRole]}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateX(0)';
                                e.target.style.background = 'white';
                                e.target.style.color = roleColors[selectedRole];
                                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                            }}
                        >
                            <span>Browse Products</span>
                            <span style={{
                                fontSize: '18px',
                                lineHeight: 1,
                                transition: 'transform 0.2s ease'
                            }}>→</span>
                        </a>
                    </div>

                    {/* Registration Notice for non-customer roles */}
                    {!isLogin && selectedRole !== 'customer' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeeba',
                            borderRadius: '10px',
                            padding: '14px 16px',
                            marginBottom: '24px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <span style={{
                                fontSize: '18px'
                            }}>ℹ️</span>
                            <span style={{
                                color: '#856404',
                                fontSize: '14px',
                                lineHeight: 1.5,
                                flex: 1
                            }}>
                                {selectedRole === 'staff'
                                    ? 'Staff accounts can only be created by administrators. Please contact your admin for access.'
                                    : 'Admin accounts can only be created by super admin. Please use your existing credentials.'}
                            </span>
                        </div>
                    )}

                    <form id="login-form" style={styles.form} onSubmit={handleSubmit}>
                        {/* Only show name field for customer registration */}
                        {!isLogin && selectedRole === 'customer' && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    style={styles.input}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    onFocus={(e) => e.target.style.borderColor = roleColors.customer}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    required
                                />
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                style={styles.input}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = roleColors[selectedRole]}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={styles.input}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onFocus={(e) => e.target.style.borderColor = roleColors[selectedRole]}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                            <a href="/forgot-password" style={{ color: roleColors[selectedRole], textDecoration: 'none', fontSize: '14px' }}>
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: !isLogin && selectedRole !== 'customer'
                                    ? '#a0aec0'
                                    : roleColors[selectedRole],
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: (loading || (!isLogin && selectedRole !== 'customer')) ? 'not-allowed' : 'pointer',
                                opacity: (loading || (!isLogin && selectedRole !== 'customer')) ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: `0 4px 12px ${roleColors[selectedRole]}40`,
                                marginTop: '8px'
                            }}
                            disabled={loading || (!isLogin && selectedRole !== 'customer')}
                            onMouseEnter={(e) => {
                                if (!loading && !(!isLogin && selectedRole !== 'customer')) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = `0 6px 16px ${roleColors[selectedRole]}60`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = `0 4px 12px ${roleColors[selectedRole]}40`;
                            }}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" style={{ color: 'white' }} />
                                    {isLogin ? 'Signing in...' : 'Creating...'}
                                </>
                            ) : (
                                isLogin
                                    ? `Sign in as ${selectedRole}`
                                    : selectedRole === 'customer'
                                        ? 'Create Account'
                                        : 'Login Required'
                            )}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#e6f3ff',
                        border: '1px solid #b8e0ff',
                        borderRadius: '10px',
                        padding: '10px 13px',
                        marginTop: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <span style={{
                            fontSize: '18px'
                        }}>ℹ️</span>
                        <span style={{
                            color: '#004085',
                            fontSize: '12px',
                            lineHeight: 1.5,
                            flex: 1
                        }}>
                            {selectedRole === 'customer' && (
                                isLogin
                                    ? 'Sign in to your customer account to access your orders and wishlist'
                                    : 'Create a customer account to enjoy personalized shopping experience'
                            )}
                            {selectedRole === 'staff' && 'Staff members: Access your dashboard and manage operations'}
                            {selectedRole === 'admin' && 'Administrators: Manage products, orders, and staff accounts'}
                        </span>
                    </div>

                    {/* Toggle - Only show for customer role */}
                    {selectedRole === 'customer' && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            color: '#64748b',
                            fontSize: '14px',
                            padding: '8px',
                            borderTop: '1px solid #e2e8f0'
                        }}>
                            {isLogin ? "New to our store?" : "Already have an account?"}
                            <span
                                style={{
                                    color: roleColors.customer,
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginLeft: '6px',
                                    textDecoration: 'underline',
                                    textDecorationColor: `${roleColors.customer}40`,
                                    textUnderlineOffset: '2px'
                                }}
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    if (!isLogin) {
                                        setForm({ ...form, name: '' });
                                    }
                                    setSelectedRole('customer');
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.textDecorationColor = roleColors.customer;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.textDecorationColor = `${roleColors.customer}40`;
                                }}
                            >
                                {isLogin ? 'Create an account' : 'Sign in'}
                            </span>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '12px'
                    }}>
                        By continuing, you agree to our{' '}
                        <a style={{
                            color: roleColors[selectedRole],
                            cursor: 'pointer',
                            textDecoration: 'none',
                            borderBottom: `1px dotted ${roleColors[selectedRole]}60`
                        }}>
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a style={{
                            color: roleColors[selectedRole],
                            cursor: 'pointer',
                            textDecoration: 'none',
                            borderBottom: `1px dotted ${roleColors[selectedRole]}60`
                        }}>
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;