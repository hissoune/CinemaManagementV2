const express = require('express');
const { createMovie, getMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');
const verifyToken = require('../midlwares/verifyToken');
const checkRole = require('../midlwares/CheckRole');

const router = express.Router();

router.post('/create', verifyToken,checkRole(['admin']), createMovie);

router.get('/',verifyToken,checkRole(['admin']), getMovies);

router.get('/:id',verifyToken,checkRole(['admin']), getMovieById);

router.put('/update/:id',verifyToken,checkRole(['admin']), verifyToken, updateMovie);

router.delete('/delete/:id',verifyToken,checkRole(['admin']), verifyToken, deleteMovie);

module.exports = router;
