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
  type: {
    type: String,
    enum: ['standard', '3D', 'IMAX'], 
    default:"standard"
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
