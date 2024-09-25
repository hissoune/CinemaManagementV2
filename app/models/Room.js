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
   isDeleted: {
    type: Boolean,
    default: false,
  }
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
RoomSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});


module.exports = mongoose.model('Room', RoomSchema);
