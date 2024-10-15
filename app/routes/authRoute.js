const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../midlwares/multerSetup');

router.post('/login', authController.login);
router.post('/register',upload.single('image'), authController.register);
router.get('/profile', authController.profile);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.requestPasswordReset);
router.post('/reset-password-fromemail/:token', authController.resetPassword);


module.exports = router;
