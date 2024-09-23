const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPass);
router.post('/reset-password-fromemail/:token', authController.resetPassword);


module.exports = router;
