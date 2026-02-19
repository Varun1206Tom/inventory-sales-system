import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    CheckCircle, 
    ShoppingBag, 
    Package, 
    Home,
    Gift,
    Truck,
    Clock,
    Mail,
    Share2,
    Printer,
    Star,
    Award,
    TrendingUp,
    Heart,
    Sparkles,
    PartyPopper,
    BadgeCheck,
    Gift as GiftIcon,
    ShoppingCart,
    User
} from 'lucide-react';
import AppNavbar from '../../components/AppNavbar';
import confetti from 'canvas-confetti';

const SuccessScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfetti, setShowConfetti] = useState(true);
    const [countdown, setCountdown] = useState(10);
    
    // Get order details from location state
    const { orderId, orderTotal, estimatedDelivery, itemsCount } = location.state || {
        orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000),
        orderTotal: 0,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        }),
        itemsCount: 1
    };

    useEffect(() => {
        // Trigger confetti animation
        if (showConfetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#28a745', '#4a90e2', '#f5a623', '#d0021b']
            });
            
            // More confetti after a delay
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#28a745', '#4a90e2']
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#f5a623', '#d0021b']
                });
            }, 300);
        }

        // Countdown timer for auto-redirect
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showConfetti]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Order Confirmation',
                text: `Just placed an order #${orderId} on ShopHub! 🎉`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(`Check out my order #${orderId} on ShopHub!`);
            alert('Order details copied to clipboard!');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(360deg, #f5f7fa 0%, #b3dbff 100%)',
            position: 'relative',
            overflow: 'hidden'
        },
        animatedBg: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(40, 167, 69, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 123, 255, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
        },
        content: {
            position: 'relative',
            zIndex: 1,
            maxWidth: '600px',
            margin: '0 auto',
            padding: '30px 15px'
        },
        successBadge: {
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '40px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
        },
        card: {
            border: 'none',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            animation: 'slideUp 0.5s ease'
        },
        cardHeader: {
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            padding: '30px 20px',
            textAlign: 'center',
            color: 'white'
        },
        iconWrapper: {
            background: 'rgba(255, 255, 255, 0.2)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            border: '3px solid rgba(255, 255, 255, 0.5)'
        },
        orderId: {
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '8px 16px',
            borderRadius: '40px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block',
            backdropFilter: 'blur(10px)'
        },
        cardBody: {
            padding: '30px'
        },
        summaryCard: {
            background: '#f8f9fa',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '25px'
        },
        summaryItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #e9ecef'
        },
        summaryLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6c757d',
            fontSize: '14px'
        },
        summaryValue: {
            fontWeight: '600',
            color: '#212529',
            fontSize: '14px'
        },
        highlightValue: {
            color: '#28a745',
            fontSize: '18px',
            fontWeight: '700'
        },
        trackingCard: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: 'white',
            marginBottom: '25px'
        },
        trackingSteps: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
            position: 'relative'
        },
        trackingStep: {
            textAlign: 'center',
            flex: 1,
            position: 'relative'
        },
        stepDot: (active) => ({
            width: '12px',
            height: '12px',
            background: active ? 'white' : 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            margin: '0 auto 8px',
            boxShadow: active ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
        }),
        stepLabel: {
            fontSize: '11px',
            opacity: 0.8
        },
        activeStepLabel: {
            fontSize: '11px',
            fontWeight: '600',
            opacity: 1
        },
        actionButtons: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '20px'
        },
        primaryButton: {
            flex: 1,
            minWidth: '160px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        },
        secondaryButton: {
            flex: 1,
            minWidth: '160px',
            padding: '12px 20px',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        iconButton: {
            padding: '10px',
            background: '#f8f9fa',
            border: 'none',
            borderRadius: '10px',
            color: '#6c757d',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '13px'
        },
        offerCard: {
            background: 'linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px',
            border: '1px solid #ffd8b0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        offerIcon: {
            background: '#fd7e14',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        offerText: {
            flex: 1
        },
        offerTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#d96c00',
            marginBottom: '2px'
        },
        offerDesc: {
            fontSize: '12px',
            color: '#b35e00'
        },
        countdown: {
            textAlign: 'center',
            marginTop: '20px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#6c757d'
        },
        footerLinks: {
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px'
        },
        footerLink: {
            color: '#6c757d',
            textDecoration: 'none',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.2s ease',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.animatedBg}></div>
            <AppNavbar />
            
            <div style={styles.content}>
                {/* Success Badge */}
                <div style={{ textAlign: 'center' }}>
                    <span style={styles.successBadge}>
                        <PartyPopper size={16} />
                        Order Confirmed!
                    </span>
                </div>

                {/* Main Card */}
                <Card style={styles.card}>
                    {/* Header */}
                    <div style={styles.cardHeader}>
                        <div style={styles.iconWrapper}>
                            <BadgeCheck size={40} color="white" />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                            Thank You for Your Order!
                        </h3>
                        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '15px' }}>
                            Your order has been placed successfully
                        </p>
                        <span style={styles.orderId}>
                            <Package size={14} style={{ marginRight: '6px' }} />
                            Order #{orderId}
                        </span>
                    </div>

                    {/* Body */}
                    <div style={styles.cardBody}>
                        {/* Order Summary */}
                        <div style={styles.summaryCard}>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                                Order Summary
                            </h5>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>
                                    <ShoppingBag size={14} />
                                    Items
                                </span>
                                <span style={styles.summaryValue}>{itemsCount} item{itemsCount > 1 ? 's' : ''}</span>
                            </div>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>
                                    <Clock size={14} />
                                    Order Date
                                </span>
                                <span style={styles.summaryValue}>
                                    {new Date().toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric' 
                                    })}
                                </span>
                            </div>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>
                                    <Truck size={14} />
                                    Estimated Delivery
                                </span>
                                <span style={{...styles.summaryValue, color: '#28a745'}}>
                                    {estimatedDelivery}
                                </span>
                            </div>
                            
                            <div style={{...styles.summaryItem, borderBottom: 'none'}}>
                                <span style={styles.summaryLabel}>
                                    <Award size={14} />
                                    Total Amount
                                </span>
                                <span style={styles.highlightValue}>
                                    ₹{orderTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Tracking Progress */}
                        <div style={styles.trackingCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h5 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Order Status</h5>
                                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
                                    Confirmed
                                </span>
                            </div>
                            
                            <div style={styles.trackingSteps}>
                                <div style={styles.trackingStep}>
                                    <div style={styles.stepDot(true)}></div>
                                    <div style={styles.activeStepLabel}>Confirmed</div>
                                </div>
                                <div style={styles.trackingStep}>
                                    <div style={styles.stepDot(false)}></div>
                                    <div style={styles.stepLabel}>Processing</div>
                                </div>
                                <div style={styles.trackingStep}>
                                    <div style={styles.stepDot(false)}></div>
                                    <div style={styles.stepLabel}>Shipped</div>
                                </div>
                                <div style={styles.trackingStep}>
                                    <div style={styles.stepDot(false)}></div>
                                    <div style={styles.stepLabel}>Delivered</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.actionButtons}>
                            <button 
                                style={styles.primaryButton}
                                onClick={() => navigate('/customer/product-catalog')}
                            >
                                <ShoppingBag size={16} />
                                Continue Shopping
                            </button>
                            
                            <button 
                                style={styles.secondaryButton}
                                onClick={() => navigate('/customer/orders')}
                            >
                                <Package size={16} />
                                Track Order
                            </button>
                        </div>

                        {/* Social/Share Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button style={styles.iconButton} onClick={handleShare}>
                                <Share2 size={14} />
                                Share
                            </button>
                            <button style={styles.iconButton} onClick={handlePrint}>
                                <Printer size={14} />
                                Print
                            </button>
                            
                        </div>

                        {/* Email Confirmation */}
                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#e3f2fd', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                            <Mail size={18} color="#1976d2" />
                            <span style={{ fontSize: '13px', color: '#1976d2' }}>
                                We've sent a confirmation email with order details
                            </span>
                        </div> */}

                        {/* Countdown */}
                        <div style={styles.countdown}>
                            <Clock size={14} style={{ marginRight: '6px' }} />
                            Redirecting to orders page in {countdown} seconds...
                        </div>

                        {/* Footer Links */}
                        <div style={styles.footerLinks}>
                            <a href="/" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                                <Home size={14} />
                                Home
                            </a>
                            <a href="/customer/cart" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate('/customer/cart'); }}>
                                <ShoppingCart size={14} />
                                Cart
                            </a>
                            <a href="/customer/profile" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate('/customer/profile'); }}>
                                <User size={14} />
                                Profile
                            </a>
                        </div>
                    </div>
                </Card>
            </div>

            <style>
                {`
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @media print {
                        button, .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default SuccessScreen;