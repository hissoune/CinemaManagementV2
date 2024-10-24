const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../midlwares/multerSetup');

router.post('/',upload.fields([{ name: 'image', maxCount: 1 }]), adminController.createUser);
router.get('/', adminController.getAllUsers);
router.put('/update/:id',upload.fields([{ name: 'image', maxCount: 1 }]), adminController.getAllUsers);
router.get('/:id', adminController.getUserById);
router.delete('/delete/:id', adminController.deleteUser);

module.exports = router;