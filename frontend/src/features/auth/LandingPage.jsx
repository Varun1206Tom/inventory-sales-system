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

    // Demo credentials for quick access
    const demoAccounts = {
        customer: { email: 'john@example.com', password: '123456' },
        staff: { email: 'staff@example.com', password: '123456' },
        admin: { email: 'admin@example.com', password: '123456' }
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

                    {/* Registration Notice for non-customer roles */}
                    {!isLogin && selectedRole !== 'customer' && (
                        <div style={styles.registrationNotice}>
                            <span>ℹ️</span>
                            <span>
                                {selectedRole === 'staff' 
                                    ? 'Staff accounts can only be created by administrators'
                                    : 'Admin accounts can only be created by super admin'
                                }
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

                        <button
                            type="submit"
                            style={styles.button(
                                loading, 
                                !isLogin && selectedRole !== 'customer' 
                                    ? '#a0aec0' // Grey out button for non-customer registration
                                    : roleColors[selectedRole]
                            )}
                            disabled={loading || (!isLogin && selectedRole !== 'customer')}
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
                    <div style={styles.infoBox}>
                        <span>ℹ️</span>
                        <span>
                            {selectedRole === 'customer' && (
                                isLogin 
                                    ? 'Sign in to your customer account'
                                    : 'Create a customer account to start shopping'
                            )}
                            {selectedRole === 'staff' && 'Staff members: Please login with your credentials'}
                            {selectedRole === 'admin' && 'Administrators: Please login with your credentials'}
                        </span>
                    </div>

                    {/* Toggle - Only show for customer role */}
                    {selectedRole === 'customer' && (
                        <div style={styles.toggleText}>
                            {isLogin ? "New customer?" : "Already have an account?"}
                            <span
                                style={styles.toggleLink(roleColors.customer)}
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    if (!isLogin) {
                                        setForm({ ...form, name: '' });
                                    }
                                    setSelectedRole('customer');
                                }}
                            >
                                {isLogin ? ' Register here' : ' Sign in'}
                            </span>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={styles.footer}>
                        By continuing, you agree to our Terms
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;