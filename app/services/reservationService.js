const Reservation = require('../models/Reservation');
const Session = require('../models/Session');
const Room = require('../models/Room');
const User = require('../models/User');
const mailer = require('../utils/mailer');

exports.createReservation = async (userId, sessionId, seatIndex) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const sessionExists = await Session.findById(sessionId).populate('room').populate('movie');
  if (!sessionExists) {
    throw new Error('Session not found');
  }

  const session = sessionExists;

  if (!session.seats[seatIndex] || !session.seats[seatIndex].available) {
    throw new Error('This seat is already reserved or does not exist');
  }

  const oldReservations = await Reservation.find({ session: sessionId });
  oldReservations.forEach(reservation => {
    if (session.seats.includes(reservation.seats)) {
      throw new Error('This seat is already reserved');
    }
  });

  session.seats[seatIndex].available = false;
  
  await session.save();

  const newReservation = new Reservation({
    user: userId,
    session: sessionId,
    seats: session.seats[seatIndex].number,
  });

  await newReservation.save();
 return session;

};


exports.getAllReservations = async (userId) => {
  return await Reservation.find({user:userId}).populate('user') 
    .populate({
        path: 'session', 
        populate: [
            { path: 'room' }, 
            { path: 'movie' } 
        ]
    });
};
 

exports.getAllReservationsAdmin = async (userId) => {
  try {
    const sessions = await Session.find({ creator:userId }); 

    if (sessions.length ==0) return [];

    const sessionIds = sessions.map(session => session._id);

    const reservations = await Reservation.find({ session: { $in: sessionIds } })
      .populate({
        path: 'user',  
        select: 'email name image', 
      })
      .populate({
        path: 'session',  
        populate: [
          { path: 'movie', select: 'title genre', model: 'Movie' }, 
          { path: 'room', select: 'roomNumber capacity', model: 'Room' }
        ]
      });


    return reservations; 
  } catch (err) {
    throw new Error('Error fetching reservations: ' + err.message);
  }
};


exports.getReservationById = async (reservationId) => {
const reservation = await Reservation.findById(reservationId)
    .populate('user') 
    .populate({
        path: 'session', 
        populate: [
            { path: 'room' }, 
            { path: 'movie' } 
        ]
    });  if (!reservation) {
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


  return updatedReservation;
};
exports.confirmeReservation = async (reservId, userId) => {
  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error('User not found');
    }

    const reservation = await Reservation.findOne({ _id: reservId, user: userId }).populate({
      path: 'session',
      populate: [
        { path: 'room' },
        { path: 'movie' },
      ],
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.confirmed) {
      throw new Error('Reservation is already confirmed');
    }

   await Reservation.findByIdAndUpdate(
      reservId,
      { confirmed: true },
      { new: true }
    );
    const confirmedReservation = await Reservation.findById(reservId).populate({
      path: 'session',
      populate: [
        { path: 'room' },
        { path: 'movie' },
      ],
    });
    const session = confirmedReservation.session;
    const room = session.room;
    const movie = session.movie;

    await mailer.sendTiketMail(userExists, confirmedReservation, session, room, movie);

    return confirmedReservation;

  } catch (error) {
    console.error(error); // Log the error for debugging
    throw new Error('Could not confirm reservation');
  }
};

exports.deleteReservation = async (reservationId, userId) => {
  const reservation = await Reservation.findOne({ _id: reservationId, user: userId }).populate({
    path: 'session',
    populate: [
      { path: 'room' },
      { path: 'movie' }
    ]
  });


  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.user.toString() !== userId) {
    throw new Error('Unauthorized: You do not have permission to delete this reservation');
  }

  if (reservation.confirmed) {
    throw new Error('Reservation is confirmed and cannot be deleted');
  }

  const currentDateTime = new Date();
  if (reservation.session.dateTime < currentDateTime) {
    throw new Error('Session is already expired, cannot delete the reservation');
  }

  const session = reservation.session;

  const seatIndex = reservation.seats - 1; 
  if (seatIndex < 0 || seatIndex >= session.seats.length) {
    throw new Error('Invalid seat number in reservation');
  }

  if (session.seats[seatIndex].available) {
    throw new Error('Seat is already marked as available, cannot proceed with deletion');
  }

  await Session.findOneAndUpdate(
    { _id: session._id },
    { $set: { [`seats.${seatIndex}.available`]: true } },
    { new: true }
  );

  await Reservation.findByIdAndUpdate(
    reservationId,
    { isDeleted: true },
    { new: true }
  );

  return { msg: 'Reservation deleted successfully and seat made available' };
};
