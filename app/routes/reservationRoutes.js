const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const upload = require('../midlwares/multerSetup');


router.post('/',upload.fields([{ name: 'image', maxCount: 1 }]), reservationController.createReservation);

router.get('/', reservationController.getAllReservations);
router.get('/admin', reservationController.getAllReservationsAdmin);

router.get('/:id', reservationController.getReservationById);

router.put('/update/:id', reservationController.updateReservation);

router.put('/confirme/:id', reservationController.confirmeReservation);

router.delete('/delete/:id', reservationController.deleteReservation);

module.exports = router;
