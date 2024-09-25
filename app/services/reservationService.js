const Reservation = require('../models/Reservation');
const Session = require('../models/Session');
const Room = require('../models/Room');
const User = require('../models/User');
const mailer = require('../utils/mailer');
exports.createReservation = async (userId, sessionId, seat) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const sessionExists = await Session.findById(sessionId).populate('room').populate('movie');
  if (!sessionExists) {
    throw new Error('Session not found');
  }

  const room = sessionExists.room;

  const movie = sessionExists.movie;

  const oldReservations = await Reservation.find({ session: sessionId });

  oldReservations.forEach(reservation => {
    if (reservation.seats === room.seats[seat-1].number) {
      throw new Error('This seat is already reserved');
    }
  });

   await Room.findOneAndUpdate(
    { _id: room._id, [`seats.${seat - 1}.number`]: seat },
    { $set: { [`seats.${seat - 1}.available`]: false } },
    { new: true }
  );
  const newReservation = new Reservation({
    user: userId,
    session: sessionId,
    seats: seat,
  });

  return await newReservation.save();
};

exports.getAllReservations = async (userId) => {
  return await Reservation.find({user:userId}).populate('user').populate('session');
};

exports.getReservationById = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId).populate('user').populate('session');
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  return reservation;
};

exports.updateReservation = async (reservationId,userId,seat) => {
 const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }
  const reserv = await Reservation.findById(reservationId).populate({
    path: 'session', 
    populate: [
      { path: 'room' },  
      { path: 'movie' }  
    ]
});

 const oldreservations = await Reservation.find({ session: reserv.session , _id: { $ne: reserv._id }}).populate({
    path: 'session', 
    populate: { path: 'room' } 
  });


   oldreservations.forEach(reserv => {
     if (reserv.session.room.seats[seat - 1].number == reserv.seats) {
          throw new Error('this seat is allredy reserved');

    }
   }); 
  const session = reserv.session;
  const room = reserv.session.room;
  const movie = reserv.session.movie;


  if (room.seats[reserv.seats - 1].number != seat) {
    await Room.findOneAndUpdate(
    { _id: room._id},
    { $set: { [`seats.${reserv.seats - 1}.available`]: true } },
    { new: true }
    );
     await Room.findOneAndUpdate(
     {_id: room._id},
    { $set: { [`seats.${seat - 1}.available`]: false } },
    { new: true }
  );
    
  }
 

  const updatedReservation = await Reservation.findByIdAndUpdate(
    reservationId,
    { seats:seat},
    { new: true}
  ).populate('user').populate('session');

  if (!updatedReservation) {
    throw new Error('Reservation not found');
  }
  await mailer.sendTiketMail(userExists, updatedReservation, session,room, movie); 


  return updatedReservation;
};

exports.deleteReservation = async (reservationId) => {

  const reservation = await Reservation.findByIdAndDelete(reservationId);

  if (!reservation) {
    throw new Error('Reservation not found');
  }
  
  return { msg: 'Reservation deleted and seat made available' };
};
