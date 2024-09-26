const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mailer = require('../utils/mailer');

exports.createUser = async (data) => {
  const { name, email, password, role } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await mailer.sendCredentials(email, name, password); 
  return await newUser.save();
};

exports.updateUser = async (id, updates) => {
  // Hash the password if it's being updated
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
  return updatedUser;
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
  const users = await User.find();
  return users;
};
