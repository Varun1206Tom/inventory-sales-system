const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const mongoose = require('mongoose');
const { sendEmail } = require('../services/emailService');

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

// Customer places an order
exports.createOrder = async (req, res) => {
    try {
        // Ensure user is authenticated (defensive check - authMiddleware should have already verified)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Please login to place an order" });
        }

        const { items } = req.body;
        const customerId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let total = 0;

        // Check stock and calculate total
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product not found` });
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            total += product.price * item.quantity;
            item.price = product.price;
        }

        // Deduct stock immediately
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        // Create order (status 'pending' so staff dashboard shows it; stock already deducted above)
        const updatedByInfo = getUpdatedByInfo(req.user);
        const order = await Order.create({
            customer: customerId,
            items,
            totalAmount: total,
            status: "pending",
            statusHistory: [{ 
                status: "pending", 
                updatedBy: updatedByInfo.updatedBy,
                updatedByName: updatedByInfo.updatedByName
            }]
        });

        // Clear customer cart after successful order
        await Cart.findOneAndUpdate(
            { customer: customerId },
            { $set: { items: [] } },
            { new: true }
        );

        // Send order confirmation email
        const user = await User.findById(customerId);
        if (user && user.email) {
            const html = `<h2>Order Confirmation</h2><p>Your order #${order._id} has been placed successfully.</p><p>Total: $${total}</p>`;
            await sendEmail(user.email, 'Order Confirmation', html);
        }

        res.json({ message: "Order placed successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// Staff/Admin updates order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const newStatus = req.body.status;
        const updatedByInfo = getUpdatedByInfo(req.user);
        order.status = newStatus;
        order.statusHistory = order.statusHistory || [];
        order.statusHistory.push({ 
            status: newStatus, 
            updatedBy: updatedByInfo.updatedBy,
            updatedByName: updatedByInfo.updatedByName
        });
        await order.save();

        // Send status update email
        const user = await User.findById(order.customer);
        if (user && user.email) {
            const html = `<h2>Order Status Update</h2><p>Your order #${order._id} status has been updated to: ${newStatus}</p>`;
            await sendEmail(user.email, 'Order Status Update', html);
        }

        res.json({ message: "Order status updated", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

// Get orders for a customer
exports.getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id }).populate('items.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// Get all orders (staff/admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate('items.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
