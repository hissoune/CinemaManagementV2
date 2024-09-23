const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../midlwares/verifyToken');

router.post('/login', authController.login);
router.post('/logout',verifyToken, authController.logout);
router.post('/reset-password', authController.requestPasswordReset);
router.post('/reset-password-fromemail/:token', authController.resetPassword);


module.exports = router;
