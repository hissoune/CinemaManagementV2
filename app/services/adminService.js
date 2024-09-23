const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.createUser =async (data) => {
    const { name, email, password, role } = data;
    const newUser = new User({ name, email, password ,role});
  return await newUser.save();
}