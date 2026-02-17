const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ customer: customerId });

        if (!cart) {
            cart = await Cart.create({ customer: customerId, items: [{ product: productId, quantity }] });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }

        res.json({ message: 'Product added to cart', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};

// GET /cart - fetch current user's cart
exports.getCart = async (req, res) => {
    try {
        const customerId = req.user.id;

        let cart = await Cart.findOne({ customer: customerId }).populate('items.product');

        if (!cart) {
            return res.json({ items: [] });
        }

        res.json({ items: cart.items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};

// DELETE /cart/:itemId - remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const itemId = req.params.itemId;

        let cart = await Cart.findOne({ customer: customerId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        await cart.save();

        res.json({ message: 'Item removed from cart', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ customer: customerId });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.product.toString() === productId);

        if (!item) return res.status(404).json({ message: 'Product not in cart' });

        if (quantity <= 0) {
            // Remove if quantity is zero or less
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();

        res.json({ message: 'Cart updated successfully', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update cart' });
    }
};