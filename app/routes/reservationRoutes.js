const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const verifyToken =require('../midlwares/verifyToken')
router.post('/',verifyToken, reservationController.createReservation);

router.get('/', reservationController.getAllReservations);

router.get('/:id', reservationController.getReservationById);

router.put('/update/:id', reservationController.updateReservation);

router.delete('/delete/:id', reservationController.deleteReservation);

module.exports = router;
