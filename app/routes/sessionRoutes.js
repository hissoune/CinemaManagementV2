const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const upload = require('../midlwares/multerSetup');

router.post('/create',upload.single('Image'), sessionController.createSession);

router.get('/', sessionController.getAllSessions);

router.get('/:id', sessionController.getSessionById);

router.put('/update/:id',upload.single('Image'), sessionController.updateSession);

router.delete('/delete/:id', sessionController.deleteSession);

module.exports = router;
