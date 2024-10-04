const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authController.profile);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.requestPasswordReset);
router.post('/reset-password-fromemail/:token', authController.resetPassword);


module.exports = router;
