const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mailer = require('../utils/mailer');

exports.createUser = async (data) => {
  const { name, email, password, role,image } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    image,
    password: hashedPassword,
    role,
  });

  await mailer.sendCredentials(email, name, password); 
  return await newUser.save();
};



exports.updateUser = async (id, updates) => {
  try {
    let originalPassword; // Variable to store the original password

    // If password is being updated, hash it
    if (updates.password) {
      originalPassword = updates.password; // Store original password
      updates.password = await bcrypt.hash(updates.password, 10); // Hash the password
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    // After successful update, send an email notifying about the changes
    if (updatedUser) {
      await mailer.sendCredentialsUpdated(updatedUser, originalPassword); // Pass the original password
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};



exports.banUser = async (id) => {
  const updatedUser = await User.findByIdAndUpdate(id, { banned: true }, { new: true });
  if (updatedUser) {
    await mailer.sendBanNotification(updatedUser);
  }
  return updatedUser;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

exports.getAllUsers = async () => {
  const users = await User.find({role:"admin"});
  return users;
};
