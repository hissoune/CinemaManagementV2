const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { getmoviesPublic,getmoviePublicById,getmovieRelatedPublicById } = require('../controllers/movieController');


router.get('/sessions',sessionController.getSessionsPublic);
router.get('/movies',getmoviesPublic);
router.get('/movies/:id',getmoviePublicById);
router.get('/moviesRelated/:id',getmovieRelatedPublicById);
router.get('/sessionsForMovis/:id',sessionController.getSessionsForMovie)







module.exports = router;