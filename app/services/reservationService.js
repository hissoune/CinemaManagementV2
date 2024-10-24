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
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }
   const reserv = await Reservation.findOne({_id: reservId ,user:userId }).populate({
    path: 'session', 
    populate: [
      { path: 'room' },  
      { path: 'movie' }  
    ]
   });
   const session = reserv.session;
  const room = reserv.session.room;
  const movie = reserv.session.movie;

  const confirmedReservation = await Reservation.findByIdAndUpdate(
  { _id: reservId },
  {confirmed: true},
  {new: true},
)
      await mailer.sendTiketMail(userExists,confirmedReservation, session,room, movie); 
  return  confirmedReservation;

}

exports.deleteReservation = async (reservationId,userId) => {

 const reservation = await Reservation.findOne({_id:reservationId , user:userId}).populate({
    path: 'session', 
    populate: [
      { path: 'room' },  
      { path: 'movie' }  
    ]
 }); 
  
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  
  if (reservation.confirmed) {
        throw new Error('Reservation is confirmed');

  }
  
  const room = reservation.session.room;

  await Room.findOneAndUpdate(
    { _id: room._id},
    { $set: { [`seats.${reservation.seats - 1}.available`]: true } },
    { new: true }
  );
  await Reservation.findByIdAndUpdate(
    { _id: reservationId },
    { isDeleted: true },
  );

  

  return { msg: 'Reservation deleted and seat made available' };
};