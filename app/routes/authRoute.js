const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../midlwares/multerSetup');

router.post('/login',upload.fields([{ name: 'image', maxCount: 1 }]), authController.login);
router.post('/register',upload.fields([{ name: 'image', maxCount: 1 }]), authController.register);
router.get('/profile', authController.profile);
router.put('/profile/favorites/:movieId', authController.favorites);
router.put('/profile',upload.fields([{ name: 'image', maxCount: 1 }]), authController.updateprofile);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.requestPasswordReset);
router.post('/reset-password-fromemail/:token', authController.resetPassword);
 

module.exports = router;
