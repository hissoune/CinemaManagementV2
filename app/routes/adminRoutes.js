const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const User = require('../models/User')

router.post('/', adminController.createUser);
router.get('/', adminController.getAllUsers);
router.put('/update/:id', adminController.getAllUsers);
router.get('/:id', adminController.getUserById);
router.delete('/delete/:id', adminController.deleteUser);

// router.get('/profile', verifyToken, async (req, res) => {
//     try {
      
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
module.exports = router;