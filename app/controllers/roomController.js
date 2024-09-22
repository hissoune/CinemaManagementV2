const Room = require('../models/Room');
const User = require('../models/User');

exports.createRoom = async (req, res) => {
  try {
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const { name, capacity, location } = req.body;

    const newRoom = new Room({
      name,
      capacity,
      location,
      creator:userId,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
     const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const rooms = await Room.find({creator:userId});
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
  try {
     const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const room = await Room.findOne({ _id: req.params.id, creator: userId });
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const userId = req.user.id; 

    const room = await Room.findOne({ _id: req.params.id, creator: userId });

    if (!room) {
      return res.status(404).json({ msg: 'Room not found or you are not the creator' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const userId = req.user.id; 

    const room = await Room.findOne({ _id: req.params.id, creator: userId });

    if (!room) {
      return res.status(404).json({ msg: 'Room not found or you are not the creator' });
    }

    await Room.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ msg: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

