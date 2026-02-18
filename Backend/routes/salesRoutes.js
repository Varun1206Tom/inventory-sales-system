const router = require('express').Router();
const ctrl = require('../controllers/saleController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', ctrl.getSalesReport);
router.get('/csv', ctrl.downloadSalesCSV);

// Staff sales history with timeframe filtering
router.get('/history/all', authMiddleware, authorizeRoles('staff', 'admin'), ctrl.getSalesHistory);

// Download sales history CSV with timeframe
router.get('/history/csv', authMiddleware, authorizeRoles('staff', 'admin'), ctrl.downloadSalesHistoryCSV);

module.exports = router;