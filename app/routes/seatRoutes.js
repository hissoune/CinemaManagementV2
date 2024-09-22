const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

const verifyToken = require('../midlwares/verifyToken');

const checkRole = require('../midlwares/CheckRole');

router.post('/',verifyToken,checkRole(['admin']), seatController.createSeat);

router.get('/',verifyToken,checkRole(['admin']), seatController.getAllSeats);

router.get('/:id',verifyToken,checkRole(['admin']), seatController.getSeatById);

router.put('/seats/:id',verifyToken,checkRole(['admin']), seatController.updateSeat);

router.delete('/seats/:id',verifyToken,checkRole(['admin']), seatController.deleteSeat);

module.exports = router;
