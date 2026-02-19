import React, { useEffect, useState, useRef } from 'react';
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
    RefreshCw,
    Sparkles,
    TrendingUp,
    Clock,
    Award,
    Gift,
    Zap,
    CheckCircle,
    XCircle,
    AlertCircle,
    ShoppingBag,
    Eye,
    ArrowRight,
    ChevronRight,
    Clock as ClockIcon // Added for order status
} from 'lucide-react';
import API from '../../services/axios';
import AppNavbar from '../../components/AppNavbar';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([
        { id: 'all', name: 'All Products', icon: '🛍️', color: '#4a90e2' }
    ]);

    // Enhanced category icons and colors
    const categoryStyles = {
        'electronics': { icon: '💻', color: '#4299e1', bg: '#ebf8ff' },
        'fashion': { icon: '👕', color: '#ed64a6', bg: '#fff5f7' },
        'home': { icon: '🏠', color: '#48bb78', bg: '#f0fff4' },
        'beauty': { icon: '💄', color: '#9f7aea', bg: '#faf5ff' },
        'sports': { icon: '⚽', color: '#f6ad55', bg: '#fffaf0' },
        'books': { icon: '📚', color: '#667eea', bg: '#ebf4ff' },
        'toys': { icon: '🧸', color: '#fc8181', bg: '#fff5f5' },
        'automotive': { icon: '🚗', color: '#a0aec0', bg: '#f7fafc' }
    };

    useEffect(() => {
        fetchProducts();
        loadCartFromStorage();
        if (accessToken) {
            fetchWishlist();
        }
        loadRecentlyViewed();
    }, [accessToken]);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await API.get('/products');
            setProducts(res.data);
            setFilteredProducts(res.data);

            // Set dynamic categories with enhanced styling
            const uniqueCategories = ['all', ...new Set(res.data.map(p => p.category).filter(Boolean))];
            setCategories(uniqueCategories.map(cat => ({
                id: cat,
                name: cat === 'all' ? 'All Products' : cat,
                icon: cat === 'all' ? '🛍️' : (categoryStyles[cat.toLowerCase()]?.icon || '📦'),
                color: cat === 'all' ? '#4a90e2' : (categoryStyles[cat.toLowerCase()]?.color || '#718096'),
                bg: cat === 'all' ? '#e3f2fd' : (categoryStyles[cat.toLowerCase()]?.bg || '#f7fafc')
            })));

            // Set trending products (simulated)
            setTrendingProducts(res.data.slice(0, 4));

        } catch (err) {
            console.error("Failed to fetch products:", err.response?.data || err.message);
            toast.error('Failed to load products. Please try again.');
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

    const fetchWishlist = async () => {
        if (!accessToken) return;
        try {
            const res = await API.get('/wishlist');
            // Extract products from wishlist items
            const products = res.data.products?.map(item => item.product) || [];
            setWishlist(products);
        } catch (err) {
            console.error('Failed to fetch wishlist:', err.response?.data || err.message);
            // Silently fail - wishlist is optional
        }
    };

    const loadRecentlyViewed = () => {
        const saved = localStorage.getItem('recentlyViewed');
        if (saved) {
            setRecentlyViewed(JSON.parse(saved));
        }
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Price range filter
        filtered = filtered.filter(product =>
            product.price >= priceRange.min && product.price <= priceRange.max
        );

        // Sorting
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
            case 'popularity':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const addToCart = async (product) => {
        // Guest user: add to localStorage cart (no API call)
        if (!accessToken) {
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItemIndex = currentCart.findIndex(
                item => item.product?._id === product._id || item.product === product._id
            );

            let updatedCart;
            if (existingItemIndex >= 0) {
                // Item exists, increment quantity
                updatedCart = [...currentCart];
                updatedCart[existingItemIndex].quantity += 1;
            } else {
                // New item, add to cart
                updatedCart = [...currentCart, { product: product, quantity: 1 }];
            }

            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            toast.success(
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '20px' }}>🛒</div>
                    <div>
                        <strong>{product.name}</strong> added!
                    </div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 2000,
                }
            );

            setAddedProduct(product);
            return;
        }

        // Logged-in user: call API
        try {
            const res = await API.post(
                '/cart/add',
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const updatedCart = res.data.cart.items.map(item => ({
                product: item.product,
                quantity: item.quantity
            }));

            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            // Show success toast
            toast.success(
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '20px' }}>🛒</div>
                    <div>
                        <strong>{product.name}</strong> added!
                    </div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 2000,
                }
            );

            setAddedProduct(product);

        } catch (err) {
            console.error("Failed to add to cart:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Failed to add item to cart');
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

    const toggleWishlist = async (product) => {
        if (!accessToken) {
            setPendingProduct(product);
            setShowLoginPopup(true);
            return;
        }

        const isInWishlist = wishlist.some(item => item._id === product._id);

        try {
            if (isInWishlist) {
                // Remove from wishlist
                await API.delete(`/wishlist/remove/${product._id}`);
                setWishlist(wishlist.filter(item => item._id !== product._id));
                toast.info(`${product.name} removed from wishlist`);
            } else {
                // Add to wishlist
                await API.post('/wishlist/add', { productId: product._id });
                setWishlist([...wishlist, product]);
                toast.success(
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Heart size={16} fill="#ff6b6b" color="#ff6b6b" />
                        <span>{product.name} added!</span>
                    </div>,
                    { icon: false, autoClose: 1500 }
                );
            }
        } catch (err) {
            console.error('Failed to update wishlist:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Failed to update wishlist');
        }
    };

    const handleProductClick = (product) => {
        // Add to recently viewed
        const updatedRecently = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 4);
        setRecentlyViewed(updatedRecently);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecently));
        navigate(`/product/${product._id}`);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return {
            text: 'Out of Stock',
            color: '#c53030',
            bg: '#fff5f5',
            icon: <XCircle size={12} />,
        };
        if (stock < 10) return {
            text: 'Low Stock',
            color: '#c05621',
            bg: '#fffaf0',
            icon: <AlertCircle size={12} />,
        };
        return {
            text: 'In Stock',
            color: '#276749',
            bg: '#f0fff4',
            icon: <CheckCircle size={12} />,
        };
    };

    const calculateDiscount = (price, mrp) => {
        if (!mrp || mrp <= price) return null;
        return Math.round(((mrp - price) / mrp) * 100);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    // Compact styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
            overflowX: 'hidden'
        },
        backgroundOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            pointerEvents: 'none',
            zIndex: 0
        },
        content: {
            position: 'relative',
            zIndex: 1
        },
        topBar: {
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: '6px 0',
            fontSize: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        },
        topBarContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
        },
        topBarLeft: {
            display: 'flex',
            gap: '24px'
        },
        topBarItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: 0.9,
        },
        topBarRight: {
            display: 'flex',
            gap: '20px'
        },
        topBarLink: {
            color: 'white',
            textDecoration: 'none',
            opacity: 0.9,
            cursor: 'pointer',
        },
        mainNav: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        },
        navWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '20px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer'
        },
        searchForm: {
            display: 'flex',
            width: '400px',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
        },
        searchInput: {
            width: '100%',
            padding: '10px 45px 10px 14px',
            border: '1px solid #e2e8f0',
            borderRight: 'none',
            borderRadius: '10px 0 0 10px',
            fontSize: '13px',
            outline: 'none',
            height: '40px',
        },
        searchBtn: {
            position: 'absolute',
            right: '3px',
            top: '3px',
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
        },
        filterBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#2d3748',
            cursor: 'pointer',
        },
        navRight: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        navIconBtn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#2d3748',
            cursor: 'pointer',
            position: 'relative',
            padding: '6px 10px',
            borderRadius: '8px',
            transition: 'all 0.2s',
            minWidth: '60px',
            ':hover': {
                background: '#f1f5f9'
            }
        },
        badge: {
            position: 'absolute',
            top: '0',
            right: '8px',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f56565 0%, #ed64a6 100%)',
            color: 'white',
            fontWeight: 600,
        },
        categorySection: {
            padding: '16px 20px',
            maxWidth: '1400px',
            margin: '0 auto'
        },
        categoryTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
            marginBottom: '12px',
        },
        categoryChips: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '20px'
        },
        categoryChip: (category) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: category.id === selectedCategory ? 'white' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: 500,
            color: category.id === selectedCategory ? category.color : 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
        }),
        filterBar: {
            background: 'white',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
        },
        filterGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
        },
        sortSelect: {
            padding: '8px 32px 8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: 'white',
            fontSize: '13px',
            cursor: 'pointer',
            outline: 'none',
            color: '#2d3748',
            fontWeight: 500,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '14px'
        },
        viewToggle: {
            display: 'flex',
            gap: '4px',
            background: '#f7fafc',
            padding: '4px',
            borderRadius: '8px'
        },
        viewBtn: (active) => ({
            padding: '6px',
            background: active ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: active ? '#667eea' : '#a0aec0',
            cursor: 'pointer',
            boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
        }),
        productsSection: {
            padding: '0 20px',
            maxWidth: '1400px',
            margin: '0 auto'
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            color: 'white'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: 700,
            margin: 0,
        },
        productCount: {
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            fontSize: '14px'
        },
        // Compact Product Card Styles
        productCard: (isHovered) => ({
            border: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative',
            height: '100%',
            background: 'white',
            boxShadow: isHovered
                ? '0 8px 20px rgba(0,0,0,0.12)'
                : '0 2px 8px rgba(0,0,0,0.06)',
            transform: isHovered ? 'translateY(-4px)' : 'none',
            cursor: 'pointer'
        }),
        discountBadge: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'linear-gradient(135deg, #f56565 0%, #ed64a6 100%)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            zIndex: 2,
            boxShadow: '0 2px 6px rgba(245, 101, 101, 0.3)',
        },
        wishlistBtn: (isInWishlist) => ({
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 2,
            color: isInWishlist ? '#f56565' : '#718096',
        }),
        productImage: {
            height: '160px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            position: 'relative',
        },
        productImageImg: {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
        },
        quickViewBtn: {
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#667eea',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        },
        productContent: {
            padding: '12px',
        },
        productCategory: {
            fontSize: '10px',
            color: '#a0aec0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        productTitle: {
            fontSize: '14px',
            fontWeight: 600,
            color: '#2d3748',
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4',
            height: '40px',
        },
        productRating: {
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            marginBottom: '8px'
        },
        starFilled: {
            fill: '#f6ad55',
            color: '#f6ad55',
            width: '12px',
            height: '12px'
        },
        starEmpty: {
            color: '#cbd5e0',
            width: '12px',
            height: '12px'
        },
        ratingCount: {
            marginLeft: '4px',
            fontSize: '10px',
            color: '#a0aec0'
        },
        productPrice: {
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap'
        },
        currentPrice: {
            fontSize: '18px',
            fontWeight: 700,
            color: '#2d3748'
        },
        originalPrice: {
            fontSize: '12px',
            color: '#a0aec0',
            textDecoration: 'line-through'
        },
        saving: {
            fontSize: '11px',
            color: '#48bb78',
            background: '#f0fff4',
            padding: '2px 6px',
            borderRadius: '12px',
            fontWeight: 600
        },
        productStock: (stockStatus) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 500,
            background: stockStatus.bg,
            color: stockStatus.color,
        }),
        addToCartBtn: (stock) => ({
            width: '100%',
            padding: '8px',
            background: stock === 0
                ? '#e2e8f0'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: stock === 0 ? '#a0aec0' : 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: stock === 0 ? 'not-allowed' : 'pointer',
        }),
        trendingSection: {
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        },
        trendingTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#2d3748',
            marginBottom: '12px'
        },
        trendingItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
        },
        trendingImage: {
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            objectFit: 'cover'
        },
        trendingInfo: {
            flex: 1
        },
        trendingName: {
            fontSize: '12px',
            fontWeight: 600,
            color: '#2d3748',
            marginBottom: '2px'
        },
        trendingPrice: {
            fontSize: '14px',
            fontWeight: 700,
            color: '#667eea'
        },
        featuresSection: {
            background: 'white',
            padding: '40px 20px',
            marginTop: '40px',
            borderRadius: '30px 30px 0 0',
        },
        featuresContainer: {
            maxWidth: '1400px',
            margin: '0 auto'
        },
        featureItem: {
            textAlign: 'center',
            padding: '16px',
        },
        featureIcon: {
            color: '#667eea',
            marginBottom: '12px',
            width: '32px',
            height: '32px'
        },
        featureTitle: {
            fontSize: '14px',
            fontWeight: 600,
            color: '#2d3748',
            marginBottom: '4px'
        },
        featureDesc: {
            fontSize: '12px',
            color: '#718096',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
        },
        modalContent: {
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '360px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        },
        modalIcon: {
            textAlign: 'center',
            marginBottom: '16px',
            fontSize: '48px',
        },
        modalTitle: {
            marginBottom: '8px',
            color: '#2d3748',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 700
        },
        modalText: {
            color: '#718096',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '14px',
        },
        modalButtons: {
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
        },
        primaryButton: {
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            flex: 1,
        },
        secondaryButton: {
            padding: '10px 20px',
            background: '#f7fafc',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1,
        },
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
        },
        loadingText: {
            color: 'white',
            fontSize: '14px',
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.7
        },
        emptyTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#2d3748',
            marginBottom: '8px'
        },
        emptyDesc: {
            fontSize: '14px',
            color: '#718096',
            marginBottom: '16px'
        },
        clearFiltersBtn: {
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
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
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
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
                <div style={styles.content}>
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <div style={styles.loadingText}>Loading products...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.backgroundOverlay}></div>

            <div style={styles.content}>
                <AppNavbar />

                {/* Top Bar */}
                <div style={styles.topBar}>
                    <div style={styles.topBarContent}>
                        <div style={styles.topBarLeft}>
                            <span style={styles.topBarItem}>
                                <Truck size={14} /> Free Shipping ₹500+
                            </span>
                            <span style={styles.topBarItem}>
                                <Shield size={14} /> Secure
                            </span>
                            <span style={styles.topBarItem}>
                                <RefreshCw size={14} /> 7-Day Returns
                            </span>
                        </div>
                        <div style={styles.topBarRight}>
                            <a href="/track-order" style={styles.topBarLink}>Track</a>
                            <a href="/help" style={styles.topBarLink}>Help</a>
                            <a href="/offers" style={styles.topBarLink}>
                                <Gift size={14} style={{ marginRight: '2px' }} />
                                Offers
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav style={styles.mainNav}>
                    <div style={styles.navWrapper}>
                        <div style={styles.logo} onClick={() => navigate('/')}>
                            <ShoppingBag size={24} />
                            <span>Shoppings</span>
                        </div>

                        <div style={styles.searchForm}>
                            <FormControl
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                            <button style={styles.searchBtn}>
                                <Search size={14} />
                            </button>
                        </div>

                        <div style={styles.navRight}>
                            {/* Orders Button - Added Back */}
                            <button
                                style={styles.navIconBtn}
                                onClick={() => navigate('/customer/orders')}
                                title="My Orders"
                            >
                                <Package size={18} />
                                <span style={{ fontSize: '10px', marginTop: '2px' }}>Orders</span>
                            </button>

                            {/* Wishlist Button */}
                            <button
                                style={styles.navIconBtn}
                                onClick={() => navigate('/customer/wishlist')}
                                title="My Wishlist"
                            >
                                <Heart size={18} />
                                {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
                                <span style={{ fontSize: '10px', marginTop: '2px' }}>Wishlist</span>
                            </button>

                            {/* Cart Button */}
                            <button
                                style={styles.navIconBtn}
                                onClick={() => navigate('/customer/cart')}
                                title="Shopping Cart"
                            >
                                <ShoppingCart size={18} />
                                {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                                <span style={{ fontSize: '10px', marginTop: '2px' }}>Cart</span>
                            </button>

                            {/* Profile Button */}
                            <button
                                style={styles.navIconBtn}
                                onClick={() => navigate('/customer/profile')}
                                title="My Profile"
                            >
                                <User size={18} />
                                <span style={{ fontSize: '10px', marginTop: '2px' }}>Profile</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Categories Section */}
                <div style={styles.categorySection}>
                    <div style={styles.categoryTitle}>
                        <Sparkles size={16} />
                        Categories
                    </div>
                    <div style={styles.categoryChips}>
                        {categories.map(cat => {
                            const category = cat.id === 'all'
                                ? { id: 'all', name: 'All Products', icon: '🛍️', color: '#4a90e2' }
                                : categoryStyles[cat.id.toLowerCase()] || { icon: '📦', color: '#718096', bg: '#f7fafc' };

                            return (
                                <button
                                    key={cat.id}
                                    style={styles.categoryChip(cat)}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filter Bar */}
                <div style={styles.productsSection}>
                    <div style={styles.filterBar}>
                        <div style={styles.filterGroup}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={styles.sortSelect}
                            >
                                <option value="default">Featured</option>
                                <option value="popularity">Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </select>
                        </div>

                        <div style={{ color: '#718096', fontSize: '13px' }}>
                            <strong>{filteredProducts.length}</strong> items
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>🔍</div>
                            <h3 style={styles.emptyTitle}>No products found</h3>
                            <p style={styles.emptyDesc}>Try adjusting your filters</p>
                            <button
                                style={styles.clearFiltersBtn}
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('default');
                                    setPriceRange({ min: 0, max: 100000 });
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <Row className="g-3">
                            {filteredProducts.map((product) => {
                                const stockStatus = getStockStatus(product.stock);
                                const isInWishlist = wishlist.some(item => item._id === product._id);
                                const discount = calculateDiscount(product.price, product.mrp);
                                const isHovered = hoveredProduct === product._id;

                                return (
                                    <Col
                                        key={product._id}
                                        lg={2}
                                        md={4}
                                        sm={6}
                                        xs={12}
                                    >
                                        <div
                                            style={styles.productCard(isHovered)}
                                            onMouseEnter={() => setHoveredProduct(product._id)}
                                            onMouseLeave={() => setHoveredProduct(null)}
                                        >
                                            {discount && (
                                                <span style={styles.discountBadge}>
                                                    {discount}% OFF
                                                </span>
                                            )}

                                            <button
                                                style={styles.wishlistBtn(isInWishlist)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWishlist(product);
                                                }}
                                            >
                                                <Heart
                                                    size={14}
                                                    fill={isInWishlist ? '#f56565' : 'none'}
                                                />
                                            </button>

                                            <div
                                                style={styles.productImage}
                                                onClick={() => handleProductClick(product)}
                                            >
                                                {product.image ? (
                                                    <img
                                                        src={product.image ? `http://localhost:5000/uploads/${product.image}` : '/placeholder.png'}
                                                        alt={product.name}
                                                        style={styles.productImageImg}
                                                    />
                                                ) : (
                                                    <div style={{ fontSize: '32px', opacity: 0.5 }}>📦</div>
                                                )}

                                                {isHovered && (
                                                    <button
                                                        style={styles.quickViewBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProductClick(product);
                                                        }}
                                                    >
                                                        <Eye size={10} />
                                                        Quick View
                                                    </button>
                                                )}
                                            </div>

                                            <div style={styles.productContent}>
                                                <div style={styles.productCategory}>
                                                    <span>{product.category || 'General'}</span>
                                                </div>

                                                <h5
                                                    style={styles.productTitle}
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    {product.name}
                                                </h5>

                                                <div style={styles.productRating}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            style={i < (product.rating || 4) ? styles.starFilled : styles.starEmpty}
                                                        />
                                                    ))}
                                                    <span style={styles.ratingCount}>
                                                        ({product.reviews || 0})
                                                    </span>
                                                </div>

                                                <div style={styles.productPrice}>
                                                    <span style={styles.currentPrice}>₹{product.price}</span>
                                                    {product.mrp && product.mrp > product.price && (
                                                        <>
                                                            <div>
                                                                <span style={styles.originalPrice}>₹{product.mrp}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                <div className='d-flex mb-2 justify-content-between align-items-center'>
                                                    {product.mrp && product.mrp > product.price && (
                                                        <div>
                                                            <span style={styles.saving}>
                                                                Save ₹{product.mrp - product.price}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div style={styles.productStock(stockStatus)}>
                                                        {stockStatus.icon}
                                                        {stockStatus.text}
                                                    </div>
                                                </div>

                                                <button
                                                    style={styles.addToCartBtn(product.stock)}
                                                    onClick={() => addToCart(product)}
                                                    disabled={product.stock === 0}
                                                >
                                                    <ShoppingCart size={14} />
                                                    {product.stock === 0 ? 'Out of Stock' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}

                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                        <div style={{ ...styles.trendingSection, marginTop: '24px' }}>
                            <div style={styles.trendingTitle}>
                                <ClockIcon size={16} color="#667eea" />
                                Recently Viewed
                            </div>
                            <Row className="g-2">
                                {recentlyViewed.map(product => (
                                    <Col key={product._id} md={3} sm={6}>
                                        <div
                                            style={styles.trendingItem}
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <img
                                                src={product.image ? `http://localhost:5000/uploads/${product.image}` : '/placeholder.png'}
                                                alt={product.name}
                                                style={styles.trendingImage}
                                            />
                                            <div style={styles.trendingInfo}>
                                                <div style={styles.trendingName}>{product.name}</div>
                                                <div style={styles.trendingPrice}>₹{product.price}</div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div style={styles.featuresSection}>
                    <div style={styles.featuresContainer}>
                        <Row className="g-3">
                            <Col md={3} sm={6}>
                                <div style={styles.featureItem}>
                                    <Truck size={28} style={styles.featureIcon} />
                                    <h5 style={styles.featureTitle}>Free Shipping</h5>
                                    <p style={styles.featureDesc}>On orders ₹500+</p>
                                </div>
                            </Col>
                            <Col md={3} sm={6}>
                                <div style={styles.featureItem}>
                                    <RefreshCw size={28} style={styles.featureIcon} />
                                    <h5 style={styles.featureTitle}>7-Day Returns</h5>
                                    <p style={styles.featureDesc}>Easy returns</p>
                                </div>
                            </Col>
                            <Col md={3} sm={6}>
                                <div style={styles.featureItem}>
                                    <Shield size={28} style={styles.featureIcon} />
                                    <h5 style={styles.featureTitle}>Secure Payment</h5>
                                    <p style={styles.featureDesc}>100% secure</p>
                                </div>
                            </Col>
                            <Col md={3} sm={6}>
                                <div style={styles.featureItem}>
                                    <Award size={28} style={styles.featureIcon} />
                                    <h5 style={styles.featureTitle}>Quality Assured</h5>
                                    <p style={styles.featureDesc}>Premium products</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Login Popup Modal */}
                {/* {showLoginPopup && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalIcon}>🔐</div>
                            <h3 style={styles.modalTitle}>Login Required</h3>
                            <p style={styles.modalText}>
                                Please login to continue
                            </p>
                            <div style={styles.modalButtons}>
                                <button
                                    style={styles.primaryButton}
                                    onClick={handleLoginRedirect}
                                >
                                    Login
                                </button>
                                <button
                                    style={styles.secondaryButton}
                                    onClick={() => {
                                        setShowLoginPopup(false);
                                        setPendingProduct(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default ProductCatalog;