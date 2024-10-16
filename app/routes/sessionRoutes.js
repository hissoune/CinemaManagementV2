const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/create', sessionController.createSession);

router.get('/', sessionController.getAllSessions);

router.get('/:id', sessionController.getSessionById);

router.put('/update/:id', sessionController.updateSession);

router.delete('/delete/:id', sessionController.deleteSession);

module.exports = router;
