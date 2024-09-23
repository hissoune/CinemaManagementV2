const seatService = require('../services/seatService');

exports.createSeat = async (req, res) => {
  try {
    const { type, room } = req.body;
    const newSeat = await seatService.createSeat(type, room);
    res.status(201).json(newSeat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const userId = req.user.id;
    const seats = await seatService.getAllSeats(userId);
    res.status(200).json(seats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getSeatById = async (req, res) => {
  try {
    const seat = await seatService.getSeatById(req.params.id);
    res.status(200).json(seat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateSeat = async (req, res) => {
  try {
    const { type, availability, room } = req.body;
    const updatedSeat = await seatService.updateSeat(req.params.id, type, availability, room);
    res.status(200).json(updatedSeat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    const result = await seatService.deleteSeat(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
