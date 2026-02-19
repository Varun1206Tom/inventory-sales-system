const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Merge guest cart (from localStorage) into user cart with stock validation
exports.mergeCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { items: guestItems } = req.body || {};

        if (!Array.isArray(guestItems) || guestItems.length === 0) {
            const cart = await Cart.findOne({ customer: customerId }).populate('items.product');
            return res.json({ items: cart?.items || [], merged: 0, skipped: [] });
        }

        let cart = await Cart.findOne({ customer: customerId });
        if (!cart) cart = await Cart.create({ customer: customerId, items: [] });

        const skipped = [];
        for (const guestItem of guestItems) {
            const productId = guestItem.productId || guestItem.product?._id || guestItem.product;
            const qty = Math.max(1, parseInt(guestItem.quantity, 10) || 1);
            if (!productId) continue;

            const product = await Product.findById(productId);
            if (!product) {
                skipped.push({ productId, reason: 'Product not found' });
                continue;
            }
            const maxQty = Math.min(qty, product.stock);
            if (maxQty <= 0) {
                skipped.push({ productId, name: product.name, reason: 'Out of stock' });
                continue;
            }

            const existing = cart.items.find(i => i.product.toString() === productId.toString());
            if (existing) {
                const newTotal = existing.quantity + maxQty;
                const capped = Math.min(newTotal, product.stock);
                existing.quantity = capped;
                if (capped < newTotal) skipped.push({ productId, name: product.name, reason: 'Capped by stock' });
            } else {
                cart.items.push({ product: productId, quantity: maxQty });
                if (maxQty < qty) skipped.push({ productId, name: product.name, reason: 'Capped by stock' });
            }
        }
        await cart.save();
        const populated = await Cart.findById(cart._id).populate('items.product');
        res.json({ items: populated.items, merged: guestItems.length, skipped });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to merge cart' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        if (product.stock < 1) return res.status(400).json({ message: `${product.name} is out of stock` });
        const addQty = Math.min(qty, product.stock);

        let cart = await Cart.findOne({ customer: customerId });

        if (!cart) {
            cart = await Cart.create({ customer: customerId, items: [{ product: productId, quantity: addQty }] });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            if (existingItem) {
                const newTotal = existingItem.quantity + addQty;
                existingItem.quantity = Math.min(newTotal, product.stock);
            } else {
                cart.items.push({ product: productId, quantity: addQty });
            }
            await cart.save();
        }

        const message = addQty < qty ? `Added ${addQty} (max available: ${product.stock})` : 'Product added to cart';
        const populated = await Cart.findById(cart._id).populate('items.product');
        res.json({ message, cart: populated });
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
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        } else {
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            if (product.stock < 1) return res.status(400).json({ message: `${product.name} is out of stock` });
            item.quantity = Math.min(quantity, product.stock);
        }

        await cart.save();

        const populated = await Cart.findById(cart._id).populate('items.product');
        res.json({ message: 'Cart updated successfully', cart: populated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update cart' });
    }
};