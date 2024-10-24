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
      console.log('Uploading image...');
      const imageFile = req.files.image[0];
      
      try {
        const imageUrl = await uploadToMinIO(imageFile);
        updates.image = imageUrl;
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const updatedUser = await adminService.updateUser(userId, updates);

    if (!updatedUser) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error during user update:', err);
    res.status(500).json({ error: err.message });
  }
};






exports.banUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await adminService.banUser(userId);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.UnbanUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await adminService.UnbanUser(userId);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

exports.getAllUsers = async () => {
  const users = await User.find({ role: "admin" }); // Get only admins
  return users;
};
