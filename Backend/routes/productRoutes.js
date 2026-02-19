const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.post('/', ctrl.upload, ctrl.addProduct);
router.get('/', ctrl.getProducts);
router.get('/low-stock', ctrl.getLowStockProducts);
router.get('/:id', ctrl.getProductById);
router.put('/:id', ctrl.upload, ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;