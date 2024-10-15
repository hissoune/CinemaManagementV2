

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');
const mailer = require('../utils/mailer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;







exports.login = async (email, password) => {
 
  
  const userexist = await User.findOne({ email});
  if (!userexist) {
    throw new  Error('User not found');
  }
 
  

  const isMatch =  bcrypt.compare(password, userexist.password);

  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload = { user: { id: userexist._id, role: userexist.role } };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1000h' });
  const basePath = 'http://localhost:3000/uploads/'; 
  const user = {
    ...userexist._doc,
    image: userexist.image
      ? `${basePath}${userexist.image.split(path.sep).join('/')}`
      : null,
  };
  return {token,user};
};







exports.register = async (data) => {
    const { name, email, password, role,image } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role ,image:image});
    await newUser.save();

    const payload = { user: { id: newUser._id, role: newUser.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1000h' });


    const basePath = 'http://localhost:3000/uploads/'; 
    const user = {
      ...newUser._doc,
      image: newUser.image
        ? `${basePath}${newUser.image.split(path.sep).join('/')}`
        : null,
    };
    return {token,user};
};




exports.logout = async (token) => {
  const decoded = jwt.decode(token);
  
  await Blacklist.create({
    token: token,
    expiresAt: new Date(decoded.exp * 1000),
  });
};

// Request Password Reset Service
exports.requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetUrl = `http://localhost:3000/api/reset-password-fromemail/${resetToken}`;
  
  await mailer.sendRessetPass(email, resetUrl);
};

// Reset Password Service
exports.resetPassword = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(newPassword, salt);

  const user = await User.findByIdAndUpdate(userId, { password: hashedPass });
  if (!user) {
    throw new Error('User not found');
  }
};







exports.Profile = async (token) => {
   

   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user.id;

  const userByid = await User.findById(userId);
  const basePath = 'http://localhost:3000/uploads/'; 
  const user = {
    ...userByid._doc,
    image: userByid.image
      ? `${basePath}${userByid.image.split(path.sep).join('/')}`
      : null,
  };
  return user;
}
