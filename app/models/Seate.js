const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['regular', 'vip', 'balcony'],
    default: 'regular',
    required: true
  },
  availability: {
    type: Boolean,
    default: true,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Seat', SeatSchema);
