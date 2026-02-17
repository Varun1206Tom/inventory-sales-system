const router = require('express').Router();
const { createOrder, updateOrderStatus, getCustomerOrders, getAllOrders } = require('../controllers/orderController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// Customer routes
router.post('/place', authMiddleware, createOrder); // place order
router.get('/', authMiddleware, getCustomerOrders); // view own orders

// Staff/Admin routes
router.get('/all', authMiddleware, authorizeRoles('staff','admin'), getAllOrders); // all orders
router.put('/:id', authMiddleware, authorizeRoles('staff','admin'), updateOrderStatus); // update order status

module.exports = router;
