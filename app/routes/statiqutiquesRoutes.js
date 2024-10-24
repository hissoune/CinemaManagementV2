
const express = require('express');
const router = express.Router();
const statiqusController = require('../controllers/statiqusController');

router.get('/', statiqusController.statiques);

module.exports = router;