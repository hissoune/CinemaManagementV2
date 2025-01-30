const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../midlwares/multerSetup');

router.post('/',upload.fields([{ name: 'image', maxCount: 1 }]), adminController.createUser);
router.get('/', adminController.getAllAdmins);
router.put('/update/:id',upload.fields([{ name: 'image', maxCount: 1 }]), adminController.updateUser);
router.delete('/banUser/:id', adminController.banUser);
router.delete('/UnbanUser/:id', adminController.UnbanUser);

module.exports = router;