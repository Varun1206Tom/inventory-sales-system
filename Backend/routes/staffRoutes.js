const router = require('express').Router();
const ctrl = require('../controllers/staffController');

router.post('/', ctrl.createStaff);
router.get('/', ctrl.getStaff);
router.put('/:id', ctrl.editStaff);
router.delete('/:id', ctrl.deleteStaff);
router.patch('/toggle/:id', ctrl.toggleStaffAccess);

module.exports = router;