const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const verifyToken = require('../midlwares/verifyToken');
const User = require('../models/User')
router.post('/users', createUser);

router.get('/profile', verifyToken, async (req, res) => {
    try {
      console.log(req.user.id);
      
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;