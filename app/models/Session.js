const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
