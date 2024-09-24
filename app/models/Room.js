const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
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
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

RoomSchema.pre('save', function(next) {
  if (this.isNew) {
    this.seats = Array.from({ length: this.capacity }, (_, index) => ({
      number: index + 1,
      available: true 
    }));
  }
  next();
});

module.exports = mongoose.model('Room', RoomSchema);
