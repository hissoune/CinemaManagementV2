const express = require('express');
const { createMovie, getMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');


const router = express.Router();

router.post('/create', createMovie);

router.get('/', getMovies);

router.get('/:id', getMovieById);

router.put('/update/:id',  updateMovie);

router.delete('/delete/:id',  deleteMovie);

module.exports = router;
