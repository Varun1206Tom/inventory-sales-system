import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../services/axios';
import { Spinner } from 'react-bootstrap';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('customer'); // Default to customer
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer' // Default role for registration
    });

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
                // Login - role will be determined by backend
                const res = await API.post('/auth/login', {
                    email: form.email.trim(),
                    password: form.password.trim()
                });

                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                const role = res.data.user.role;
                toast.success(`Welcome back! Redirecting...`);

                // Redirect based on role
                if (role === 'admin') navigate('/admin');
                else if (role === 'staff') navigate('/staff');
                else navigate('/');
            } else {
                // Register - with selected role
                await API.post('/auth/register', {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password.trim(),
                    role: form.role // Send selected role to backend
                });

                toast.success("Registration successful! Please login.");
                setIsLogin(true);
                setForm({ name: '', email: '', password: '', role: 'customer' });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || (isLogin ? "Invalid Credentials" : "Registration Failed"));
        } finally {
            setLoading(false);
        }
    };

    // Quick access for demo purposes
    const quickAccess = (role, email, password) => {
        setForm({ ...form, email, password });
        setSelectedRole(role);
        // Auto submit after a brief delay
        setTimeout(() => {
            document.getElementById('login-form').dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }, 100);
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        card: {
            display: 'flex',
            maxWidth: '1200px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        },
        leftPanel: {
            flex: '1.2',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        },
        rightPanel: {
            flex: '1',
            padding: '40px',
            backgroundColor: 'white'
        },
        brandName: {
            fontSize: '30px',
            fontWeight: '700',
            marginBottom: '10px',
            letterSpacing: '-0.5px'
        },
        brandSub: {
            fontSize: '14px',
            opacity: '0.9',
            marginBottom: '30px',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            paddingBottom: '20px'
        },
        roleCards: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginBottom: '30px'
        },
        roleCard: (isActive, roleColor) => ({
            backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: isActive ? `2px solid ${roleColor}` : '2px solid transparent'
        }),
        roleIcon: {
            fontSize: '24px',
            marginBottom: '8px'
        },
        roleTitle: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '4px'
        },
        roleDesc: {
            fontSize: '11px',
            opacity: '0.8',
            lineHeight: '1.4'
        },
        featureSection: {
            marginTop: 'auto'
        },
        featureTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px'
        },
        featureList: {
            listStyle: 'none',
            padding: 0,
            margin: 0
        },
        featureItem: (roleColor) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            fontSize: '13px',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            borderLeft: `3px solid ${roleColor}`
        }),
        featureIcon: {
            fontSize: '16px'
        },
        demoSection: {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '12px'
        },
        demoTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '10px'
        },
        demoButtons: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
        },
        demoButton: (roleColor) => ({
            padding: '8px',
            fontSize: '11px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderLeft: `2px solid ${roleColor}`
        }),
        title: {
            fontSize: '28px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '14px',
            color: '#718096',
            marginBottom: '24px'
        },
        roleSelector: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            padding: '4px',
            backgroundColor: '#f7fafc',
            borderRadius: '10px'
        },
        roleTab: (isActive, roleColor) => ({
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '500',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: isActive ? 'white' : 'transparent',
            color: isActive ? roleColor : '#718096',
            boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s',
            border: isActive ? `1px solid ${roleColor}` : '1px solid transparent'
        }),
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#4a5568'
        },
        input: {
            padding: '12px 16px',
            fontSize: '14px',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            backgroundColor: '#f7fafc'
        },
        button: (isLogin, roleColor) => ({
            padding: '12px',
            fontSize: '15px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: roleColor,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        }),
        toggleText: {
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#718096'
        },
        toggleLink: (roleColor) => ({
            color: roleColor,
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'none',
            marginLeft: '4px'
        }),
        infoBox: {
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#ebf8ff',
            borderRadius: '10px',
            border: '1px solid #bee3f8',
            fontSize: '13px',
            color: '#2c5282'
        }
    };

    // Role-based colors
    const roleColors = {
        customer: '#48bb78', // Green
        staff: '#f6ad55',    // Orange
        admin: '#f56565'      // Red
    };

    // Role-based features
    const roleFeatures = {
        customer: [
            'Browse products catalog',
            'Place new orders',
            'Track order status',
            'View order history',
        ],
        staff: [
            'Process customer orders',
            'Update stock levels',
            'Manage inventory',
            'View sales reports',
        ],
        admin: [
            'Full system access',
            'Manage staff accounts',
            'View all reports',
            'Monitor all activities'
        ]
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Left Panel - Role-based Information */}
                <div style={styles.leftPanel}>
                    <div>
                        <div style={styles.brandName}>Inventory & Sales Mgt</div>
                        <div style={styles.brandSub}>Complete Inventory & Order Management System</div>
                    </div>

                    {/* Role Cards */}
                    <div style={styles.roleCards}>
                        {['customer', 'staff', 'admin']
                            .filter(role => isLogin || role === 'customer') // Show all if logged in, otherwise only customer
                            .map((role) => (
                                <div
                                    key={role}
                                    style={styles.roleCard(selectedRole === role, roleColors[role])}
                                    onClick={() => {
                                        setSelectedRole(role);
                                        if (!isLogin) setForm({ ...form, role });
                                    }}
                                >
                                    <div style={styles.roleIcon}>
                                        {role === 'customer' && '🛍️'}
                                        {role === 'staff' && '👥'}
                                        {role === 'admin' && '👑'}
                                    </div>
                                    <div style={styles.roleTitle}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </div>
                                    <div style={styles.roleDesc}>
                                        {role === 'customer' && 'Browse & place orders'}
                                        {role === 'staff' && 'Process orders & manage stock'}
                                        {role === 'admin' && 'Full system control'}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Features for selected role */}
                    <div style={styles.featureSection}>
                        <div style={styles.featureTitle}>
                            {selectedRole === 'customer' && '🛍️ Customer Features'}
                            {selectedRole === 'staff' && '👥 Staff Features'}
                            {selectedRole === 'admin' && '👑 Admin Features'}
                        </div>
                        <ul style={styles.featureList}>
                            {roleFeatures[selectedRole].map((feature, index) => (
                                <li key={index} style={styles.featureItem(roleColors[selectedRole])}>
                                    <span style={styles.featureIcon}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Demo Quick Access */}
                    {/* <div style={styles.demoSection}>
                        <div style={styles.demoTitle}>🔑 Quick Demo Access</div>
                        <div style={styles.demoButtons}>
                            <button
                                style={styles.demoButton(roleColors.customer)}
                                onClick={() => quickAccess('customer')}
                            >
                                🛍️ Customer
                            </button>
                            <button
                                style={styles.demoButton(roleColors.staff)}
                                onClick={() => quickAccess('staff',)}
                            >
                                👥 Staff
                            </button>
                            <button
                                style={styles.demoButton(roleColors.admin)}
                                onClick={() => quickAccess('admin',)}
                            >
                                👑 Admin
                            </button>
                        </div>
                    </div> */}
                </div>

                {/* Right Panel - Auth Form */}
                <div style={styles.rightPanel}>
                    <h2 style={styles.title}>
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p style={styles.subtitle}>
                        {isLogin
                            ? `Sign in as ${selectedRole}`
                            : `Register as ${selectedRole}`}
                    </p>

                    {/* Role Selector for Registration */}
                    {/* {!isLogin && (
                        <div style={styles.roleSelector}>
                            {['customer', 'staff', 'admin'].map((role) => (
                                <div
                                    key={role}
                                    style={styles.roleTab(form.role === role, roleColors[role])}
                                    onClick={() => setForm({ ...form, role })}
                                >
                                    {role === 'customer' && '🛍️ '}
                                    {role === 'staff' && '👥 '}
                                    {role === 'admin' && '👑 '}
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </div>
                            ))}
                        </div>
                    )} */}

                    <form id="login-form" style={styles.form} onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    style={styles.input}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = roleColors[selectedRole];
                                        e.target.style.boxShadow = `0 0 0 3px ${roleColors[selectedRole]}20`;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                style={styles.input}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                onFocus={(e) => {
                                    e.target.style.borderColor = roleColors[selectedRole];
                                    e.target.style.boxShadow = `0 0 0 3px ${roleColors[selectedRole]}20`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
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
                                onFocus={(e) => {
                                    e.target.style.borderColor = roleColors[selectedRole];
                                    e.target.style.boxShadow = `0 0 0 3px ${roleColors[selectedRole]}20`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={styles.button(isLogin, roleColors[selectedRole])}
                            disabled={loading}
                            onMouseOver={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.opacity = '0.9';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.opacity = '1';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" style={{ color: 'white' }} />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                isLogin ? `Sign in as ${selectedRole}` : `Register as ${selectedRole}`
                            )}
                        </button>
                    </form>

                    {/* Role-specific info */}
                    <div style={styles.infoBox}>
                        <strong>ℹ️ {selectedRole === 'customer' && 'Customers: '}
                            {selectedRole === 'staff' && 'Staff Members: '}
                            {selectedRole === 'admin' && 'Administrators: '}</strong>
                        {selectedRole === 'customer' && 'Browse products, place orders, and track your purchases.'}
                        {selectedRole === 'staff' && 'Process orders, update inventory, and manage stock levels.'}
                        {selectedRole === 'admin' && 'Full system access with user management and reports.'}
                    </div>

                    {/* Toggle between Login/Register */}
                    {selectedRole === 'customer' && (
                        <div style={styles.toggleText}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <span
                                style={styles.toggleLink(roleColors[selectedRole])}
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    if (!isLogin) {
                                        // When switching to login, clear the form but keep role selection
                                        setForm({ ...form, name: '' });
                                    }
                                }}
                            >
                                {isLogin ? 'Register here' : ' Sign in'}
                            </span>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ ...styles.footer, marginTop: '16px', fontSize: '11px', color: '#a0aec0', textAlign: 'center' }}>
                        By continuing, you agree to our Terms of Service
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;