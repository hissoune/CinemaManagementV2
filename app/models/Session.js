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
  },
   isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });
SessionSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});
module.exports = mongoose.model('Session', SessionSchema);
