const Reservation = require('../models/Reservation');
const Session = require('../models/Session');
const User = require('../models/User');

exports.createReservation = async (userId, sessionId, seat) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const sessionExists = await Session.findById(sessionId);

   if (!sessionExists) {
    throw new Error('Session not found');
  }

  
  const oldreservations = await Reservation.find({ session: sessionId }) .populate({
    path: 'session', 
    populate: { path: 'room' } 
  });


   oldreservations.forEach(reserv => {
     if (reserv.session.room.seats[seat - 1] == reserv.seats) {
          throw new Error('this seat is allredy reserved');

    }
   });

  const newReservation = new Reservation({
    user: userId,
    session: sessionId,
    seats: seat,
  });

  return await newReservation.save();
};

exports.getAllReservations = async () => {
  return await Reservation.find().populate('user').populate('session');
};

exports.getReservationById = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId).populate('user').populate('session');
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  return reservation;
};

exports.updateReservation = async (reservationId, seat, confirmed) => {

  const reserv = await Reservation.findById(reservationId);
 const oldreservations = await Reservation.find({ session: reserv.session }) .populate({
    path: 'session', 
    populate: { path: 'room' } 
  });


   oldreservations.forEach(reserv => {
     if (reserv.session.room.seats[seat - 1] == reserv.seats) {
          throw new Error('this seat is allredy reserved');

    }
   });

  const updatedReservation = await Reservation.findByIdAndUpdate(
    reservationId,
    { seats: seat, confirmed },
  ).populate('user').populate('session');

  if (!updatedReservation) {
    throw new Error('Reservation not found');
  }

  return updatedReservation;
};

exports.deleteReservation = async (reservationId) => {
  const reservation = await Reservation.findByIdAndDelete(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  return { msg: 'Reservation deleted and seat made available' };
};
