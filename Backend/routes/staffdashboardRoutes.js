const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/staffDashboardController'); // new controller

// Dashboard stats
router.get('/stats', authMiddleware, authorizeRoles('staff','admin'), ctrl.getStaffStats);

// Recent orders
router.get('/recent-orders', authMiddleware, authorizeRoles('staff','admin'), ctrl.getRecentOrders);

// Process a single order
router.put('/orders/:orderId/process', authMiddleware, authorizeRoles('staff','admin'), ctrl.processOrder);

// Sales history
router.get('/sales', authMiddleware, authorizeRoles('staff','admin'), ctrl.getSalesHistory);

module.exports = router;