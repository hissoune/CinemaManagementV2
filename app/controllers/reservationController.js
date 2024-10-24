const reservationService = require('../services/reservationService');
const reservationValidation = require('../utils/validations/reservationValidation');
exports.createReservation = async (req, res) => {
//  const { error } = reservationValidation.validateReservation(req.body);
//   if (error) {
//    return  res.status(400).json(error.details[0].message)
//   }
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
    const { seats } = req.body;
    const updatedReservation = await reservationService.updateReservation(reservationId,userId,seats);
    res.status(200).json(updatedReservation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.confirmeReservation = async (req, res) => {
  const userId = req.user.id;
  const reservId = req.params.id;
  
  try {
          const result = await reservationService.confirmeReservation(reservId,userId);
    res.status(200).json(result);
  } catch (error) {
     res.status(500).json({ msg: error.message });
  }

}

exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user.id;
    const result = await reservationService.deleteReservation(reservationId,userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
