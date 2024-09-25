const reservationService = require('../services/reservationService');

exports.createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { session, seats } = req.body;
    const newReservation = await reservationService.createReservation(userId, session, seats);
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllReservations = async (req, res) => {
  const userId = req.user.id;
  try {

    const reservations = await reservationService.getAllReservations(userId);
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await reservationService.getReservationById(reservationId);
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user.id;
    const updatedReservation = await reservationService.updateReservation(reservationId,userId);
    res.status(200).json(updatedReservation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const result = await reservationService.deleteReservation(reservationId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
