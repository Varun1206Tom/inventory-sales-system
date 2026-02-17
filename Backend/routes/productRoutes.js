const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.post('/', ctrl.addProduct);
router.get('/', ctrl.getProducts);
router.put('/:id', ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

router.get('/low-stock', ctrl.getLowStockProducts);

module.exports = router;