const express = require('express');

const router = express.Router();

const roomController = require('../controllers/roomController');
const upload = require('../midlwares/multerSetup');

router.post('/create',upload.single('Image'), roomController.createRoom);

router.get('/', roomController.getAllRooms);

router.get('/:id', roomController.getRoomById);

router.put('/update/:id',upload.single('Image'), roomController.updateRoom);

router.delete('/delete/:id', roomController.deleteRoom);

module.exports = router;
