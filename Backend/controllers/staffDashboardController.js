const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to get updatedBy info (handles admin case)
const getUpdatedByInfo = (user) => {
    const userId = user.id || user._id;
    // Check if it's the hardcoded admin (not a valid ObjectId)
    if (userId === "admin-id" || !mongoose.Types.ObjectId.isValid(userId)) {
        return {
            updatedBy: null,
            updatedByName: user.name || user.email || "Admin"
        };
    }
    return {
        updatedBy: userId,
        updatedByName: user.name || user.email || null
    };
};

// Stats for dashboard
exports.getStaffStats = async (req, res) => {
    try {
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const totalSales = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const lowStockItems = await Product.countDocuments({ stock: { $lt: 5 } });

        res.json({
            pendingOrders,
            processingOrders,
            completedOrders,
            totalSales: totalSales[0]?.total || 0,
            totalCustomers,
            lowStockItems
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

// Recent orders
exports.getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('customer', 'name')
            .populate('items.product');
        
        const formatted = orders.map(o => ({
            _id: o._id,
            orderId: o._id.toString().slice(-6),
            customerName: o.customer?.name || 'Unknown',
            items: o.items,
            total: o.totalAmount,
            status: o.status,
            createdAt: o.createdAt
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch recent orders" });
    }
};

// Process order (mark as processing/completed). Stock was already deducted when order was placed.
exports.processOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // 'processing' or 'completed'

        const order = await Order.findById(orderId).populate('items.product');
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (status === 'completed') {
            // Verify stock still sufficient (no double-deduction; stock was taken at place order)
            for (const item of order.items) {
                const product = await Product.findById(item.product._id);
                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({
                        message: product
                            ? `Insufficient stock for ${product.name}`
                            : 'Product not found'
                    });
                }
            }
        }

        const updatedByInfo = getUpdatedByInfo(req.user);
        order.status = status;
        order.statusHistory = order.statusHistory || [];
        order.statusHistory.push({ 
            status, 
            updatedBy: updatedByInfo.updatedBy,
            updatedByName: updatedByInfo.updatedByName
        });
        await order.save();

        res.json({ message: `Order ${status}`, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to process order" });
    }
};

// Sales history
exports.getSalesHistory = async (req, res) => {
    try {
        const sales = await Order.find({ status: 'completed' })
            .populate('customer', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch sales history" });
    }
};

// Get all orders (for admin/staff order management)
exports.getAllOrders = async (req, res) => {
    try {
        const { status } = req.query; // Optional status filter
        
        let filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate('customer', 'name email')
            .populate('items.product', 'name price');

        const formatted = orders.map(o => ({
            _id: o._id,
            orderId: o._id.toString().slice(-6),
            customerName: o.customer?.name || 'Unknown',
            items: o.items,
            totalAmount: o.totalAmount,
            status: o.status,
            statusHistory: o.statusHistory || [],
            createdAt: o.createdAt
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// Update order status (for admin - no stock deduction)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const updatedByInfo = getUpdatedByInfo(req.user);
        order.status = status;
        order.statusHistory = order.statusHistory || [];
        order.statusHistory.push({ 
            status, 
            updatedBy: updatedByInfo.updatedBy,
            updatedByName: updatedByInfo.updatedByName
        });
        await order.save();

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update order status" });
    }
};