const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  seats: {
     type: mongoose.Schema.Types.ObjectId,
    ref:'Seat',
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
