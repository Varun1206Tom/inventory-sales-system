import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../features/admin/AdminDashboard';
import StaffDashboard from '../features/staff/StaffDashboard';
import StaffOrderProcessing from '../features/staff/StaffOrderProcessing';
import CustomerDashboard from '../features/customer/CustomerDashboard';
import ProtectedRoute from './ProtectedRoute';
import Register from '../features/auth/Register';
import LandingPage from '../features/auth/LandingPage';
import ForgotPassword from '../features/auth/ForgotPassword';
import ResetPassword from '../features/auth/ResetPassword';
import ProductCatalog from '../features/customer/ProductCatalog';
import ProductDetail from '../features/customer/ProductDetail';
import Cart from '../features/customer/Cart';
import SuccessScreen from '../features/customer/SuccessScreen';
import MyOrders from '../features/customer/MyOrders';
import Wishlist from '../features/customer/Wishlist';
import Profile from '../features/customer/Profile';
import AdminSalesReport from '../features/admin/SalesReport';
import SalesHistory from '../features/staff/SalesHistory';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LandingPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<SuccessScreen />} />
            <Route path="/customer/cart" element={<Cart />} />

            <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            <Route path="/admin/sales" element={
                <ProtectedRoute allowedRole="admin">
                    <AdminSalesReport />
                </ProtectedRoute>
            } />

            <Route path="/staff" element={
                <ProtectedRoute allowedRole="staff">
                    <StaffDashboard />
                </ProtectedRoute>
            } />

            <Route path="/staff/orders" element={
                <ProtectedRoute allowedRole="staff">
                    <StaffOrderProcessing />
                </ProtectedRoute>
            } />

            <Route path="/staff/sales" element={
                <ProtectedRoute allowedRole="staff">
                    <SalesHistory />
                </ProtectedRoute>
            } />

            <Route path="/customer" element={
                <ProtectedRoute allowedRole="customer">
                    <CustomerDashboard />
                </ProtectedRoute>
            } />

            <Route path="/customer/product-catalog" element={
                <ProtectedRoute allowedRole="customer">
                    <ProductCatalog />
                </ProtectedRoute>
            } />

            {/* <Route path="/customer/cart" element={
                <ProtectedRoute allowedRole="customer">
                    <Cart />
                </ProtectedRoute>
            } /> */}

            <Route path="/customer/orders" element={
                <ProtectedRoute allowedRole="customer">
                    <MyOrders />
                </ProtectedRoute>
            } />

            <Route path="/customer/wishlist" element={
                <ProtectedRoute allowedRole="customer">
                    <Wishlist />
                </ProtectedRoute>
            } />

            <Route path="/customer/profile" element={
                <ProtectedRoute allowedRole="customer">
                    <Profile />
                </ProtectedRoute>
            } />
        </Routes>
    );
}
