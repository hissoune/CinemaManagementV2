const express = require('express');

const router = express.Router();
const verifyToken = require('../midlwares/verifyToken');
const checkRole = require('../midlwares/CheckRole');
const roomController = require('../controllers/roomController');

router.post('/',verifyToken,checkRole(['admin']), roomController.createRoom);

router.get('/',verifyToken,checkRole(['admin']), roomController.getAllRooms);

router.get('/:id',verifyToken,checkRole(['admin']), roomController.getRoomById);

router.put('/update/:id',verifyToken,checkRole(['admin']), roomController.updateRoom);

router.delete('/delete/:id',verifyToken,checkRole(['admin']), roomController.deleteRoom);

module.exports = router;
