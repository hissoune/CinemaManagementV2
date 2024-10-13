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


RoomSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});


module.exports = mongoose.model('Room', RoomSchema);
