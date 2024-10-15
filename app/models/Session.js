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
  seats: [{
    number: {
      type: Number,
      required: true
    },
    available: {
      type: Boolean,
      default: true 
    }
  }],
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
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, { timestamps: true });

SessionSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});


module.exports = mongoose.model('Session', SessionSchema);
