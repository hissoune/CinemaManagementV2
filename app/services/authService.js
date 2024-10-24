

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');
const mailer = require('../utils/mailer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;







exports.login = async (email, password) => {
 
  
  const user = await User.findOne({ email});
  if (!user) {
    throw new  Error('User not found');
  }
 
  

  const isMatch =  bcrypt.compare(password, user.password);

  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload = { user: { id: user._id, role: user.role } };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1000h' });
 
  return {token,user};
};







exports.register = async (data) => {
    const { name, email, password, role,image } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role ,image:image});
    await user.save();

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1000h' });


   
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
  const resetUrl = `http://localhost:5173/reset-password-fromemail/${resetToken}`;
  
  await mailer.sendRessetPass(email, resetUrl);
};

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

  const user = await User.findById(userId).populate({
    path: 'favorites',
    model: 'Movie'  // Ensures it looks up the Movie collection
});  

  return user;
}


exports.updateUser = async (userId, updatedData,image) => {
  if (image) {
    updatedData.image = image;
}
  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId,           
          updatedData,      
          { new: true }    
      );

      if (!updatedUser) {
          throw new Error('User not found');
      }

      return updatedUser; 
  } catch (error) {
      throw new Error(error.message || 'Failed to update user');
  }
};

exports.favorites = async (movieId, userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    let updateOperation;
    if (user.favorites.includes(movieId)) {
      updateOperation = { $pull: { favorites: movieId } };
    } else {
      updateOperation = { $addToSet: { favorites: movieId } };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateOperation,
      { new: true, runValidators: false } 
    );

    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error.message || 'Failed to update favorites');
  }
};

