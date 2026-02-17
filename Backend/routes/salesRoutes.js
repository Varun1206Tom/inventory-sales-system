const router = require('express').Router();
const ctrl = require('../controllers/saleController');

router.get('/', ctrl.getSalesReport);
router.get('/csv', ctrl.downloadSalesCSV);

module.exports = router;