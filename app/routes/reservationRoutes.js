const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const verifyToken = require('../midlwares/verifyToken');

const checkRole = require('../midlwares/CheckRole');

router.post('/',verifyToken,checkRole(['client']), reservationController.createReservation);

router.get('/',verifyToken,checkRole(['client']), reservationController.getAllReservations);

router.get('/:id',verifyToken,checkRole(['client']), reservationController.getReservationById);

router.put('/update/:id',verifyToken,checkRole(['client']), reservationController.updateReservation);

router.delete('/delete/:id',verifyToken,checkRole(['client']), reservationController.deleteReservation);

module.exports = router;
