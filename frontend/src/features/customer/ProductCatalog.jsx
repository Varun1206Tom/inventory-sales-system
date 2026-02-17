import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Badge, Container, Form, FormControl } from 'react-bootstrap';
import {
    ShoppingCart,
    User,
    Package,
    Search,
    Heart,
    Filter,
    Grid,
    List,
    ChevronDown,
    Star,
    Truck,
    Shield,
    RefreshCw
} from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { useNavigate } from 'react-router-dom';

const ProductCatalog = () => {

    const accessToken = localStorage.getItem('token');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [showCartAlert, setShowCartAlert] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid');
    const [wishlist, setWishlist] = useState([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);
    const navigate = useNavigate();

    // Categories
    const categories = [
        { id: 'all', name: 'All Products', icon: '📦' },
        { id: 'electronics', name: 'Electronics', icon: '💻' },
        { id: 'fashion', name: 'Fashion', icon: '👕' },
        { id: 'home', name: 'Home & Living', icon: '🏠' },
        { id: 'beauty', name: 'Beauty', icon: '💄' },
        { id: 'sports', name: 'Sports', icon: '⚽' }
    ];

    useEffect(() => {
        fetchProducts();
        loadCartFromStorage();
        loadWishlistFromStorage();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, searchTerm, selectedCategory, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await API.get('/products');
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCartFromStorage = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    };

    const loadWishlistFromStorage = () => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const addToCart = async (product) => {
        if (!accessToken) {
            setPendingProduct(product);
            setShowLoginPopup(true);
            return;
        }

        try {
            // Call backend API
            const res = await API.post(
                '/cart/add',
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            // Update local cart state
            const updatedCart = res.data.cart.items.map(item => ({
                product: item.product,
                quantity: item.quantity
            }));

            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            setAddedProduct(product);
            setShowCartAlert(true);
            setTimeout(() => setShowCartAlert(false), 3000);

        } catch (err) {
            console.error("Failed to add to cart:", err.response?.data || err.message);
        }
    };


    const handleLoginRedirect = () => {
        setShowLoginPopup(false);
        navigate('/login', {
            state: {
                from: '/customer/products',
                pendingProduct: pendingProduct
            }
        });
    };

    const toggleWishlist = (product) => {
        let updatedWishlist;
        if (wishlist.some(item => item._id === product._id)) {
            updatedWishlist = wishlist.filter(item => item._id !== product._id);
        } else {
            updatedWishlist = [...wishlist, product];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: '#dc3545', bg: '#f8d7da', icon: '❌' };
        if (stock < 10) return { text: 'Low Stock', color: '#856404', bg: '#fff3cd', icon: '⚠️' };
        return { text: 'In Stock', color: '#155724', bg: '#d4edda', icon: '✅' };
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    // Styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: '#f1f3f6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
        },
        topBar: {
            background: '#2c3e50',
            color: 'white',
            padding: '8px 0',
            fontSize: '13px'
        },
        topBarContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px'
        },
        topBarLeft: {
            display: 'flex',
            gap: '24px'
        },
        topBarItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        topBarRight: {
            display: 'flex',
            gap: '20px'
        },
        topBarLink: {
            color: 'white',
            textDecoration: 'none',
            opacity: 0.9,
            cursor: 'pointer'
        },
        mainNav: {
            background: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        },
        navWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px'
        },
        categoriesBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        dropdownMenu: {
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '250px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            padding: '8px 0',
            marginTop: '8px',
            opacity: 0,
            visibility: 'hidden',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
            zIndex: 1000
        },
        dropdownItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            color: '#2c3e50',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        dropdownItemActive: {
            background: '#e3f2fd',
            color: '#4a90e2',
            fontWeight: 500
        },
        searchForm: {
            display: 'flex',
            width: '500px',
            position: 'relative'
        },
        searchInput: {
            width: '100%',
            padding: '8px 40px 8px 12px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            height: '36px'
        },
        searchBtn: {
            position: 'absolute',
            right: '3px',
            top: '3px',
            padding: '5px 12px',
            background: '#4a90e2',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            height: '30px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
        },
        navRight: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
        },
        navIconBtn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#2c3e50',
            cursor: 'pointer',
            position: 'relative',
            padding: '4px 8px',
            transition: 'all 0.2s ease'
        },
        badge: {
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            fontSize: '10px',
            padding: '3px 6px',
            borderRadius: '10px',
            background: '#4a90e2',
            color: 'white'
        },
        secondaryNav: {
            background: 'white',
            borderBottom: '1px solid #e9ecef',
            padding: '16px 0'
        },
        secondaryNavContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px'
        },
        categoryChips: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
        },
        categoryChip: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '30px',
            fontSize: '14px',
            color: '#495057',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        categoryChipActive: {
            background: '#4a90e2',
            color: 'white',
            borderColor: '#4a90e2'
        },
        viewOptions: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        sortSelect: {
            padding: '8px 32px 8px 12px',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            background: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none'
        },
        viewToggle: {
            display: 'flex',
            gap: '4px',
            background: '#f8f9fa',
            padding: '4px',
            borderRadius: '6px'
        },
        viewBtn: {
            padding: '6px',
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            color: '#6c757d',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        viewBtnActive: {
            background: '#4a90e2',
            color: 'white'
        },
        productsSection: {
            padding: '20px 24px',
            maxWidth: '1400px',
            margin: '0 auto'
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: 600,
            color: '#2c3e50',
            margin: 0
        },
        productCount: {
            color: '#6c757d',
            margin: 0
        },
        cartAlert: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            minWidth: '300px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.3s ease'
        },
        alertContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px'
        },
        alertIcon: {
            fontSize: '24px'
        },
        alertText: {
            flex: 1
        },
        alertActions: {
            display: 'flex',
            gap: '12px',
            marginTop: '8px'
        },
        viewCartLink: {
            color: '#4a90e2',
            background: 'none',
            border: 'none',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline'
        },
        continueShopping: {
            color: '#6c757d',
            background: 'none',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer'
        },
        productCard: {
            border: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative',
            height: '100%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            background: 'white'
        },
        discountBadge: {
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#ff6b6b',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            zIndex: 1
        },
        wishlistBtn: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            zIndex: 1
        },
        productImage: {
            height: '200px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            cursor: 'pointer'
        },
        productImageImg: {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
        },
        noImage: {
            fontSize: '48px',
            opacity: 0.5
        },
        productCategory: {
            fontSize: '12px',
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
        },
        productTitle: {
            fontSize: '16px',
            fontWeight: 600,
            color: '#2c3e50',
            marginBottom: '8px',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        },
        productDescription: {
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '12px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        },
        productRating: {
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            marginBottom: '12px'
        },
        ratingCount: {
            marginLeft: '6px',
            fontSize: '12px',
            color: '#6c757d'
        },
        productPrice: {
            marginBottom: '12px'
        },
        currentPrice: {
            fontSize: '18px',
            fontWeight: 700,
            color: '#4a90e2'
        },
        originalPrice: {
            fontSize: '14px',
            color: '#6c757d',
            textDecoration: 'line-through',
            marginLeft: '8px'
        },
        saving: {
            display: 'inline-block',
            marginLeft: '8px',
            fontSize: '12px',
            color: '#28a745',
            background: '#d4edda',
            padding: '2px 6px',
            borderRadius: '4px'
        },
        productStock: (stock) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '12px',
            background: stock.bg,
            color: stock.color
        }),
        addToCartBtn: (stock) => ({
            width: '100%',
            padding: '10px',
            background: stock === 0 ? '#e9ecef' : '#4a90e2',
            color: stock === 0 ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: stock === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
        }),
        listViewCard: {
            display: 'flex',
            flexDirection: 'row',
            height: '280px'
        },
        listViewImage: {
            width: '280px',
            height: '100%',
            flexShrink: 0
        },
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px'
        },
        spinner: {
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #4a90e2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '20px',
            opacity: 0.5
        },
        featuresSection: {
            background: 'white',
            padding: '60px 24px',
            marginTop: '40px',
            borderTop: '1px solid #e9ecef'
        },
        featuresContainer: {
            maxWidth: '1400px',
            margin: '0 auto'
        },
        featureItem: {
            textAlign: 'center',
            color: '#2c3e50'
        },
        featureIcon: {
            color: '#4a90e2',
            marginBottom: '16px'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        },
        modalContent: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        },
        modalIcon: {
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '48px'
        },
        modalTitle: {
            marginBottom: '12px',
            color: '#2c3e50',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 600
        },
        modalText: {
            color: '#6c757d',
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '14px'
        },
        modalButtons: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
        },
        primaryButton: {
            padding: '10px 24px',
            background: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
        },
        secondaryButton: {
            padding: '10px 24px',
            background: '#e9ecef',
            color: '#495057',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
        }
    };

    // Add keyframe animations
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    if (loading) {
        return (
            <div style={styles.container}>
                <AppNavbar />
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p>Loading amazing products...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <AppNavbar />

            {/* Top Bar */}
            <div style={styles.topBar}>
                <div style={styles.topBarContent}>
                    <div style={styles.topBarLeft}>
                        <span style={styles.topBarItem}>
                            <Truck size={16} /> Free Shipping
                        </span>
                        <span style={styles.topBarItem}>
                            <Shield size={16} /> Get Live Updates
                        </span>
                        <span style={styles.topBarItem}>
                            <RefreshCw size={16} /> Easy Return
                        </span>
                    </div>
                    <div style={styles.topBarRight}>
                        <a href="/track-order" style={styles.topBarLink}>Track Order</a>
                        {/* <a href="/help" style={styles.topBarLink}>Help Center</a> */}
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav style={styles.mainNav}>
                <div style={styles.navWrapper}>
                    <div style={styles.searchForm}>
                        <FormControl
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                        <button style={styles.searchBtn}>
                            <Search size={15} />
                        </button>
                    </div>

                    <div style={styles.navRight}>
                        <button
                            style={styles.navIconBtn}
                            onClick={() => navigate('/customer/cart')}
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                            <span style={{ fontSize: '12px', marginTop: '4px' }}>Cart</span>
                        </button>

                        <button
                            style={styles.navIconBtn}
                            onClick={() => navigate('/customer/orders')}
                        >
                            <Package size={22} />
                            <span style={{ fontSize: '12px', marginTop: '4px' }}>Orders</span>
                        </button>

                        <button
                            style={styles.navIconBtn}
                            onClick={() => navigate('/customer/profile')}
                        >
                            <User size={22} />
                            <span style={{ fontSize: '12px', marginTop: '4px' }}>Profile</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Cart Alert */}
            {showCartAlert && addedProduct && (
                <div style={styles.cartAlert}>
                    <div style={styles.alertContent}>
                        <span style={styles.alertIcon}>✅</span>
                        <div style={styles.alertText}>
                            <strong>{addedProduct.name}</strong> added to cart!
                            <div style={styles.alertActions}>
                                <button
                                    style={styles.viewCartLink}
                                    onClick={() => navigate('/customer/cart')}
                                >
                                    View Cart
                                </button>
                                <button
                                    style={styles.continueShopping}
                                    onClick={() => setShowCartAlert(false)}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Popup Modal */}
            {showLoginPopup && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalIcon}>🔐</div>
                        <h3 style={styles.modalTitle}>Login Required</h3>
                        <p style={styles.modalText}>
                            Please login to add items to your cart and continue shopping.
                        </p>
                        <div style={styles.modalButtons}>
                            <button
                                style={styles.primaryButton}
                                onClick={handleLoginRedirect}
                            >
                                Login Now
                            </button>
                            <button
                                style={styles.secondaryButton}
                                onClick={() => {
                                    setShowLoginPopup(false);
                                    setPendingProduct(null);
                                }}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div style={styles.productsSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>
                        {selectedCategory === 'all' ? 'All Products' :
                            categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p style={styles.productCount}>{filteredProducts.length} products found</p>
                </div>

                {filteredProducts.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🔍</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter to find what you're looking for.</p>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                                setSortBy('default');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <Row className={viewMode === 'grid' ? 'g-4' : ''}>
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stock);
                            const isInWishlist = wishlist.some(item => item._id === product._id);

                            return (
                                <Col
                                    key={product._id}
                                    lg={viewMode === 'grid' ? 3 : 12}
                                    md={viewMode === 'grid' ? 4 : 12}
                                    sm={6}
                                    xs={12}
                                >
                                    <div
                                        style={{
                                            ...styles.productCard,
                                            ...(viewMode === 'list' ? styles.listViewCard : {})
                                        }}
                                    >
                                        {product.discount && (
                                            <span style={styles.discountBadge}>
                                                -{product.discount}%
                                            </span>
                                        )}

                                        <div
                                            style={{
                                                ...styles.productImage,
                                                ...(viewMode === 'list' ? styles.listViewImage : {})
                                            }}
                                            // onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={styles.productImageImg}
                                                />
                                            ) : (
                                                <div style={styles.noImage}>📦</div>
                                            )}
                                        </div>

                                        <div style={{ padding: '20px' }}>
                                            <div style={styles.productCategory}>
                                                {product.category || 'Smart Phones'}
                                            </div>
                                            <h5
                                                style={styles.productTitle}
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.name}
                                            </h5>

                                            {viewMode === 'list' && (
                                                <p style={styles.productDescription}>
                                                    {product.description || 'No description available'}
                                                </p>
                                            )}

                                            <div style={styles.productPrice}>
                                                <span style={styles.currentPrice}>₹{product.price}</span>
                                                {product.originalPrice && (
                                                    <>
                                                        <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                                                        <span style={styles.saving}>
                                                            Save ₹{product.originalPrice - product.price}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            <div style={styles.productStock(stockStatus)}>
                                                <span>{stockStatus.icon}</span>
                                                {stockStatus.text}
                                            </div>

                                            <button
                                                style={styles.addToCartBtn(product.stock)}
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                            >
                                                <ShoppingCart size={18} />
                                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>

            {/* Features Section */}
            <div style={styles.featuresSection}>
                <div style={styles.featuresContainer}>
                    <Row className="g-4">
                        <Col md={3} sm={6}>
                            <div style={styles.featureItem}>
                                <Truck size={32} style={styles.featureIcon} />
                                <h5>Free Shipping</h5>
                                <p>On orders above ₹500</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <div style={styles.featureItem}>
                                <RefreshCw size={32} style={styles.featureIcon} />
                                <h5>7-Day Returns</h5>
                                <p>Easy return policy</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <div style={styles.featureItem}>
                                <Shield size={32} style={styles.featureIcon} />
                                <h5>Secure Payment</h5>
                                <p>100% secure transactions</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <div style={styles.featureItem}>
                                <Package size={32} style={styles.featureIcon} />
                                <h5>Quick Delivery</h5>
                                <p>Fast shipping worldwide</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog;