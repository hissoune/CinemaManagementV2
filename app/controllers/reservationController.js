const Reservation = require('../models/Reservation');
const Session = require('../models/Session');
const Seat = require('../models/Seate');
const User = require('../models/User');

exports.createReservation = async (req, res) => {
  try {
    const { session, seats } = req.body;

    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const sessionExists = await Session.findById(session);
    if (!sessionExists) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    const seatExists = await Seat.findById(seats);
    if (!seatExists || !seatExists.availability) {
      return res.status(404).json({ msg: 'Seat not found or unavailable' });
    }

    seatExists.availability = false;
    await seatExists.save();

    const newReservation = new Reservation({
      user: userId,
      session,
      seats,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user').populate('session').populate('seats');
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('user').populate('session').populate('seats');
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { seats, confirmed } = req.body;

    const seatExists = await Seat.findById(seats);
    if (!seatExists || !seatExists.availability) {
      return res.status(404).json({ msg: 'Seat not found or unavailable' });
    }

    seatExists.availability = false;
    await seatExists.save();

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { seats, confirmed },
      { new: true }
    ).populate('user').populate('session').populate('seats');

    if (!updatedReservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    res.status(200).json(updatedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Make the seat available again
    const seat = await Seat.findById(reservation.seats);
    if (seat) {
      seat.availability = true;
      await seat.save();
    }

    res.status(200).json({ msg: 'Reservation deleted and seat made available' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
