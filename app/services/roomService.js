const Room = require('../models/Room');
const User = require('../models/User');
const Session = require('../models/Session');

exports.createRoom = async (userId, name, capacity, location) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const newRoom = new Room({
    name,
    capacity,
    location,
    creator: userId,
  });

  return await newRoom.save();
};

exports.getAllRooms = async (userId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  return await Room.find({ creator: userId }).populate('creator');
};

exports.getRoomById = async (roomId, userId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const room = await Room.findOne({ _id: roomId, creator: userId }).populate('creator');
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
};

exports.updateRoom = async (roomId, userId, updateData) => {
  const room = await Room.findOne({ _id: roomId, creator: userId });
  if (!room) {
    throw new Error('Room not found or you are not the creator');
  }

  const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true }).populate('creator');
  return updatedRoom;
};

exports.deleteRoom = async (roomId, userId) => {
  const room = await Room.findOne({ _id: roomId, creator: userId });
  console.log(room);
  
  if (!room) {
    throw new Error('Room not found or you are not the creator');
  }
  const session = await Session.find({ room: roomId});
  if (session.length>0) {
        throw new Error('Room have a Session');

  }
  await Room.findByIdAndUpdate(roomId, {isDeleted: true});
  return { msg: 'Room deleted successfully' };
};
