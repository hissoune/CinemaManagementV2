const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  value: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
