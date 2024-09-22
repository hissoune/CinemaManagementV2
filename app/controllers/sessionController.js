const Session = require('../models/Session');
const Movie = require('../models/Movie');
const Room = require('../models/Room');

exports.createSession = async (req, res) => {
  try {
    const { movie, room, dateTime, price } = req.body;

    const movieExists = await Movie.findById(movie);
    const roomExists = await Room.findById(room);

    if (!movieExists || !roomExists) {
      return res.status(404).json({ msg: 'Movie or Room not found' });
    }

    const newSession = new Session({
      movie,
      room,
      dateTime,
      price,
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('movie room');
    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('movie room');
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { movie, room, dateTime, price } = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { movie, room, dateTime, price },
      { new: true }
    ).populate('movie room');

    if (!updatedSession) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    res.status(200).json(updatedSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(200).json({ msg: 'Session deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
