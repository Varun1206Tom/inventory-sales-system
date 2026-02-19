const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlist
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.post('/add', authMiddleware, addToWishlist);
router.delete('/remove/:productId', authMiddleware, removeFromWishlist);
router.get('/', authMiddleware, getWishlist);
router.get('/check/:productId', authMiddleware, checkWishlist);

module.exports = router;
