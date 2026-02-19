const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const staffCtrl = require('../controllers/staffController');
const dashboardCtrl = require('../controllers/staffDashboardController');

// —— Dashboard routes (staff + admin) — specific paths first
router.get('/stats', authMiddleware, authorizeRoles('staff', 'admin'), dashboardCtrl.getStaffStats);
router.get('/recent-orders', authMiddleware, authorizeRoles('staff', 'admin'), dashboardCtrl.getRecentOrders);
router.get('/orders', authMiddleware, authorizeRoles('staff', 'admin'), dashboardCtrl.getAllOrders);
router.put('/orders/:orderId', authMiddleware, authorizeRoles('staff', 'admin'), dashboardCtrl.updateOrderStatus);
router.put('/orders/:orderId/process', authMiddleware, authorizeRoles('staff', 'admin'), dashboardCtrl.processOrder);
router.get('/sales', authMiddleware, authorizeRoles('staff', 'admin'), dashboardCtrl.getSalesHistory);

// —— Staff CRUD (admin only)
router.post('/', authMiddleware, authorizeRoles('admin'), staffCtrl.createStaff);
router.get('/', authMiddleware, authorizeRoles('admin'), staffCtrl.getStaff);
router.put('/:id', authMiddleware, authorizeRoles('admin'), staffCtrl.editStaff);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), staffCtrl.deleteStaff);
router.patch('/toggle/:id', authMiddleware, authorizeRoles('admin'), staffCtrl.toggleStaffAccess);

module.exports = router;
