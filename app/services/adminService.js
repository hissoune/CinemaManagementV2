const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mailer = require('../utils/mailer')

exports.createUser =async (data) => {
  const { name, email, password, role } = data;
  
  const newUser = new User({ name, email, password, role });
  mailer.sendCredentials(email, name, password);
  return await newUser.save();
}