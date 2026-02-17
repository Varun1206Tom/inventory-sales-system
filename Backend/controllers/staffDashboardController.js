const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

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
            orderId: o._id.slice(-6),
            customerName: o.customer.name,
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

// Process order (mark as processing/completed, deduct stock)
exports.processOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // 'processing' or 'completed'

        const order = await Order.findById(orderId).populate('items.product');
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (status === 'completed') {
            for (const item of order.items) {
                const product = await Product.findById(item.product._id);
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                }
                product.stock -= item.quantity;
                await product.save();
            }
        }

        order.status = status;
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