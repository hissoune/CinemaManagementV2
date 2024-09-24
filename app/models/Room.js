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
  seats:[ {
    type: Number,
    required:true
  }],
   creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required:true
  },
 
}, { timestamps: true });


RoomSchema.pre('save', function(next) {
  if (this.isNew) {
    this.seats = Array.from({ length: this.capacity }, (_, index) => index + 1);
  }
  next();
});

module.exports = mongoose.model('Room', RoomSchema);
