const Reservation = require('../models/Reservation');
const Session = require('../models/Session');
const Seat = require('../models/Seate');
const User = require('../models/User');

exports.createReservation = async (userId, sessionId, seatId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const sessionExists = await Session.findById(sessionId);
  if (!sessionExists) {
    throw new Error('Session not found');
  }

  const seatExists = await Seat.findById(seatId);
  if (!seatExists || !seatExists.availability) {
    throw new Error('Seat not found or unavailable');
  }

  seatExists.availability = false;
  await seatExists.save();

  const newReservation = new Reservation({
    user: userId,
    session: sessionId,
    seats: seatId,
  });

  return await newReservation.save();
};

exports.getAllReservations = async () => {
  return await Reservation.find().populate('user').populate('session').populate('seats');
};

exports.getReservationById = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId).populate('user').populate('session').populate('seats');
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  return reservation;
};

exports.updateReservation = async (reservationId, seatId, confirmed) => {
  const seatExists = await Seat.findById(seatId);
  if (!seatExists || !seatExists.availability) {
    throw new Error('Seat not found or unavailable');
  }

  seatExists.availability = false;
  await seatExists.save();

  const updatedReservation = await Reservation.findByIdAndUpdate(
    reservationId,
    { seats: seatId, confirmed },
    { new: true }
  ).populate('user').populate('session').populate('seats');

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

  const seat = await Seat.findById(reservation.seats);
  if (seat) {
    seat.availability = true;
    await seat.save();
  }

  return { msg: 'Reservation deleted and seat made available' };
};
