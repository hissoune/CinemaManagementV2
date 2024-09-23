const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');



router.post('/', seatController.createSeat);

router.get('/', seatController.getAllSeats);

router.get('/:id', seatController.getSeatById);

router.put('/seats/:id', seatController.updateSeat);

router.delete('/seats/:id', seatController.deleteSeat);

module.exports = router;
