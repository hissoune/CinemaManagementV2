const Seat = require('../models/Seate');
const Room = require('../models/Room');

exports.createSeat = async (type, roomId) => {
  const roomExists = await Room.findById(roomId);
  if (!roomExists) {
    throw new Error('Room not found');
  }

  const seatCount = await Seat.countDocuments({ room: roomExists._id });
  if (seatCount >= roomExists.capacity) {
    throw new Error(`Room is full. Capacity is ${roomExists.capacity}`);
  }

  const newSeat = new Seat({
    type,
    room: roomId,
  });

  return await newSeat.save();
};

exports.getAllSeats = async (userId) => {
  const rooms = await Room.find({ creator: userId });
  const roomIds = rooms.map(room => room._id);
  return await Seat.find({ room: { $in: roomIds } }).populate('room');
};

exports.getSeatById = async (seatId) => {
  const seat = await Seat.findById(seatId).populate('room');
  if (!seat) {
    throw new Error('Seat not found');
  }
  return seat;
};

exports.updateSeat = async (seatId, type, availability, roomId) => {
  const roomExists = await Room.findById(roomId);
  if (!roomExists) {
    throw new Error('Room not found');
  }

  const updatedSeat = await Seat.findByIdAndUpdate(
    seatId,
    { type, availability, room: roomId },
    { new: true }
  ).populate('room');

  if (!updatedSeat) {
    throw new Error('Seat not found');
  }

  return updatedSeat;
};

exports.deleteSeat = async (seatId) => {
  const seat = await Seat.findByIdAndDelete(seatId);
  if (!seat) {
    throw new Error('Seat not found');
  }

  return { msg: 'Seat deleted successfully' };
};
