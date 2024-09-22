const express = require('express');
const { createMovie, getMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');
const verifyToken = require('../midlwares/verifyToken');
const checkRole = require('../midlwares/CheckRole');

const router = express.Router();

router.post('/create', verifyToken, createMovie);

router.get('/', getMovies);

router.get('/:id', getMovieById);

router.put('/update/:id', verifyToken, updateMovie);

router.delete('/delete/:id', verifyToken, deleteMovie);

module.exports = router;
