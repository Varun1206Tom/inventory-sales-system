const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ customer: customerId });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                customer: customerId,
                products: [{ product: productId }]
            });
        } else {
            // Check if product already in wishlist
            const exists = wishlist.products.some(
                item => item.product.toString() === productId.toString()
            );

            if (exists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            wishlist.products.push({ product: productId });
            await wishlist.save();
        }

        const populated = await Wishlist.findById(wishlist._id).populate('products.product');
        res.json({ message: 'Product added to wishlist', wishlist: populated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add to wishlist' });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ customer: customerId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId.toString()
        );

        await wishlist.save();

        const populated = await Wishlist.findById(wishlist._id).populate('products.product');
        res.json({ message: 'Product removed from wishlist', wishlist: populated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove from wishlist' });
    }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        const customerId = req.user.id;

        const wishlist = await Wishlist.findOne({ customer: customerId })
            .populate('products.product');

        if (!wishlist) {
            return res.json({ products: [] });
        }

        res.json({ products: wishlist.products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
};

// Check if product is in wishlist
exports.checkWishlist = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ customer: customerId });

        if (!wishlist) {
            return res.json({ inWishlist: false });
        }

        const inWishlist = wishlist.products.some(
            item => item.product.toString() === productId.toString()
        );

        res.json({ inWishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to check wishlist' });
    }
};
