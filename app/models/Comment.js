const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
