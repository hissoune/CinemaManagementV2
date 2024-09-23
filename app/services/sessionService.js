const Session = require('../models/Session');
const Movie = require('../models/Movie');
const Room = require('../models/Room');

exports.createSession = async (movieId, roomId, dateTime, price) => {
  const movieExists = await Movie.findById(movieId);
  const roomExists = await Room.findById(roomId);

  if (!movieExists || !roomExists) {
    throw new Error('Movie or Room not found');
  }

  const newSession = new Session({
    movie: movieId,
    room: roomId,
    dateTime,
    price,
  });

  return await newSession.save();
};

exports.getAllSessions = async (userId) => {
  const sessions = await Session.find()
    .populate('movie')
    .populate('room')
    .exec();

  return sessions.filter(session =>
    (session.movie && session.movie.creator.toString() === userId) ||
    (session.room && session.room.creator.toString() === userId)
  );
};

exports.getSessionById = async (sessionId) => {
  const session = await Session.findById(sessionId).populate('movie room');
  if (!session) {
    throw new Error('Session not found');
  }
  return session;
};

exports.updateSession = async (sessionId, movieId, roomId, dateTime, price) => {
  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    { movie: movieId, room: roomId, dateTime, price },
    { new: true }
  ).populate('movie room');

  if (!updatedSession) {
    throw new Error('Session not found');
  }

  return updatedSession;
};

exports.deleteSession = async (sessionId) => {
  const session = await Session.findByIdAndDelete(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  return { msg: 'Session deleted successfully' };
};
