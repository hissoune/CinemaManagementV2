const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const verifyToken = require('../midlwares/verifyToken');
const checkRole = require('../midlwares/CheckRole');
router.post('/',verifyToken,checkRole(['admin']), sessionController.createSession);

router.get('/',verifyToken,checkRole(['admin']), sessionController.getAllSessions);

router.get('/:id',verifyToken,checkRole(['admin']), sessionController.getSessionById);

router.put('/update/:id',verifyToken,checkRole(['admin']), sessionController.updateSession);

router.delete('/delete/:id',verifyToken,checkRole(['admin']), sessionController.deleteSession);

module.exports = router;
