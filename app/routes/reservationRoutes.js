const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');


router.post('/', reservationController.createReservation);

router.get('/', reservationController.getAllReservations);

router.get('/:id', reservationController.getReservationById);

router.put('/update/:id', reservationController.updateReservation);
router.put('/confirme/:id', reservationController.confirmeReservation);

router.delete('/delete/:id', reservationController.deleteReservation);

module.exports = router;
