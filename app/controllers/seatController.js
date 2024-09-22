const Seat = require('../models/Seate');
const Room = require('../models/Room');

exports.createSeat = async (req, res) => {
  try {
    const { type, room } = req.body;

    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    const seatCount = await Seat.countDocuments({ room: roomExists._id });

    if (seatCount >= roomExists.capacity) {
      return res.status(400).json({ msg: `Room is full. Capacity is ${roomExists.capacity}` });
    }

    const newSeat = new Seat({
      type,
      room
    });

    await newSeat.save();
    res.status(201).json(newSeat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllSeats = async (req, res) => {
 try {
    const userId = req.user.id; 

    const rooms = await Room.find({ creator: userId });

    const roomIds = rooms.map(room => room._id);

    const seats = await Seat.find({ room: { $in: roomIds } }).populate('room');

    res.status(200).json(seats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate('room');
    if (!seat) {
      return res.status(404).json({ msg: 'Seat not found' });
    }
    res.status(200).json(seat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateSeat = async (req, res) => {
  try {
    const { type, availability, room } = req.body;

    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    const updatedSeat = await Seat.findByIdAndUpdate(
      req.params.id,
      { type, availability, room },
      { new: true }
    ).populate('room');

    if (!updatedSeat) {
      return res.status(404).json({ msg: 'Seat not found' });
    }

    res.status(200).json(updatedSeat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) {
      return res.status(404).json({ msg: 'Seat not found' });
    }
    res.status(200).json({ msg: 'Seat deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
