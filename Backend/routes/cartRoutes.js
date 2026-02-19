const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { addToCart, getCart, removeFromCart, updateCartItem, mergeCart } = require('../controllers/cartController');

router.post('/merge', authMiddleware, mergeCart);
router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/:itemId', authMiddleware, removeFromCart);
router.put('/update', authMiddleware, updateCartItem);

module.exports = router;