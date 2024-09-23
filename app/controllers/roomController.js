const roomService = require('../services/roomService');

exports.createRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, capacity, location } = req.body;
    const newRoom = await roomService.createRoom(userId, name, capacity, location);
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await roomService.getAllRooms(userId);
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.id;
    const room = await roomService.getRoomById(roomId, userId);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.id;
    const updateData = req.body;
    const updatedRoom = await roomService.updateRoom(roomId, userId, updateData);
    res.status(200).json(updatedRoom);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.id;
    const result = await roomService.deleteRoom(roomId, userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
