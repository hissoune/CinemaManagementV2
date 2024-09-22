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
    required:true
  },
 
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
