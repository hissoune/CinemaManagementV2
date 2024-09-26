const adminService = require('../services/adminService');
const adminValidation = require('../utils/validations/adminValidation');
exports.createUser = async (req, res) => {
  const { error } = adminValidation.adminValidation.validate(req.body);
  if (error) {
   return  res.status(400).json(error.details[0].message)
  }
  try {
    const { name, email, password, role } = req.body;
    const newUser = await adminService.createUser({ name, email, password, role });
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
   const { error } = adminValidation.adminValidation.validate(req.body);
  if (error) {
   return  res.status(400).json(error.details[0].message)
  }
  try {
    const userId = req.params.id;
    const updates = req.body; // You can define allowed fields for updates
    const updatedUser = await adminService.updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await adminService.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await adminService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
