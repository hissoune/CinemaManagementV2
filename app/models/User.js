const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
  favorites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Movie', 
  }],
  banned: {
    type: Boolean,
    default: false, 
  }
}, { timestamps: true });



module.exports = mongoose.model('User', UserSchema);
