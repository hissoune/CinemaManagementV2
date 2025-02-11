const Session = require('../models/Session');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

exports.createSession = async (movieId, roomId, dateTime, price, creator) => {
  const movieExists = await Movie.findById(movieId);
  const roomExists = await Room.findById(roomId);

  if (!movieExists || !roomExists) {
    throw new Error('Movie or Room not found');
  }

  const roomCapacity = roomExists.capacity;

  const seats = [];
  for (let i = 1; i <= roomCapacity; i++) {
    seats.push({ number: i, available: true });
  }

  const newSession = new Session({
    movie: movieId,
    room: roomId,
    dateTime,
    price,
    seats, 
    creator,
  });

  return await newSession.save();
};


exports.getAllSessions = async () => {
  const sessions = await Session.find()
    .populate({
      path: 'movie',
      populate: { path: 'creator', select: 'name email' } 
    })
    .populate({
      path: 'room',
      populate: { path: 'creator', select: 'name email' } 
    })
    .populate('creator', 'name email') 
    .exec();

  return sessions;
};

exports.getSessionById = async (sessionId) => {
  const session = await Session.findById(sessionId)
    .populate({
      path: 'movie',
      populate: { path: 'creator', select: 'name email' } // Populating movie's creator details
    })
    .populate({
      path: 'room',
      populate: { path: 'creator', select: 'name email' } // Populating room's creator details
    })
    .populate('creator', 'name email') // Populate session's creator
    .exec();

  if (!session) {
    throw new Error('Session not found');
  }

  return session;
};

exports.updateSession = async (sessionId, movieId, roomId, dateTime, price, userId) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.creator.toString() !== userId) {
    throw new Error('You are not authorized to update this session');
  }

  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    { movie: movieId, room: roomId, dateTime, price },
    { new: true }
  )
    .populate({
      path: 'movie',
      populate: { path: 'creator', select: 'name email' }
    })
    .populate({
      path: 'room',
      populate: { path: 'creator', select: 'name email' } 
    })
    .populate('creator', 'name email') 
    .exec();

  return updatedSession;
};

exports.deleteSession = async (sessionId, userId) => {
  // Check if there are any reservations for the session
  const reservations = await Reservation.find({ session: sessionId });
  
  if (reservations.length > 0) {
    throw new Error('Cannot delete a session with reservations');
  }

  // Find the session by ID and populate the necessary fields
  const session = await Session.findById(sessionId)
    .populate({
      path: 'room',
      populate: { path: 'creator', select: 'name email' }
    })
    .populate('creator', 'name email');

  // Check if the session exists
  if (!session) {
    throw new Error('Session not found');
  }

  // Check if the user is authorized to delete the session
  if (session.creator._id.toString() !== userId) {
    throw new Error('You are not authorized to delete this session');
  }

  session.isDeleted = true;

  if (session.seats && session.seats.length > 0) {
    session.seats.forEach(seat => {
      seat.isDeleted = true;
    });
  }

  await session.save();

  return { msg: 'Session deleted successfully' };
};

exports.getAllSessionsPublic = async () => {
  const currentDate = new Date();  

  const sessions = await Session.find({ dateTime: { $gte: currentDate } })
    .populate({
      path: 'movie',
      populate: { path: 'creator', select: 'name email' }
    })
    .populate({
      path: 'room',
      populate: { path: 'creator', select: 'name email' }
    })
    .populate('creator', 'name email')
    .exec();

  return sessions;
};

exports.getSessionsForMovie = async (moviId) => {

  
  const sessions = await Session.find({ movie: moviId }).populate({
      path: 'movie',
      populate: { path: 'creator', select: 'name email' } 
    })
    .populate({
      path: 'room',
      populate: { path: 'creator', select: 'name email' } 
    })
    .populate('creator', 'name email') 
    .exec();
    
  return sessions;
}
