const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Customer places an order
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const customerId = req.user.id; // req.user is set by auth middleware

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

        // Create order
        const order = await Order.create({
            customer: customerId,
            items,
            totalAmount: total,
            status: "placed"
        });

        // Clear customer cart after successful order
        await Cart.findOneAndUpdate(
            { customer: customerId },
            { $set: { items: [] } },
            { new: true }
        );

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

        order.status = req.body.status;
        await order.save();

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
