const User = require('../models/User');
const adminService = require('../services/adminService'); 
const { uploadToMinIO } = require('../services/uploadService');



exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const imageFile = req.files?.image ? req.files.image[0] : null; 
    const imageUrl = imageFile ? await uploadToMinIO(imageFile) : null; 

    const newUser = await adminService.createUser({
      name,
      email,
      password,
      role,
      image: imageUrl, 
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (req.files?.image) {
      const imageFile = req.files.image[0];
      const imageUrl = await uploadToMinIO(imageFile); 
      updates.image = imageUrl;
    }

    const updatedUser = await adminService.updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





exports.deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

exports.getAllUsers = async () => {
  const users = await User.find({ role: "admin" }); // Get only admins
  return users;
};
