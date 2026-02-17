import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login';
import AdminDashboard from '../features/admin/AdminDashboard';
import StaffDashboard from '../features/staff/StaffDashboard';
import CustomerDashboard from '../features/customer/CustomerDashboard';
import ProtectedRoute from './ProtectedRoute';
import Register from '../features/auth/Register';
import LandingPage from '../features/auth/LandingPage';
import ProductCatalog from '../features/customer/ProductCatalog';
import Cart from '../features/customer/Cart';
import SuccessScreen from '../features/customer/SuccessScreen';
import MyOrders from '../features/customer/MyOrders';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LandingPage />} />
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<SuccessScreen />} />

            <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            <Route path="/staff" element={
                <ProtectedRoute allowedRole="staff">
                    <StaffDashboard />
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

            <Route path="/customer/cart" element={
                <ProtectedRoute allowedRole="customer">
                    <Cart />
                </ProtectedRoute>
            } />

            <Route path="/customer/orders" element={
                <ProtectedRoute allowedRole="customer">
                    <MyOrders />
                </ProtectedRoute>
            } />
        </Routes>
    );
}
