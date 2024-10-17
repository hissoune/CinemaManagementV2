const express = require('express');
const { createMovie, getMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');
const upload = require('../midlwares/multerSetup');

const router = express.Router();

router.post('/create',upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]),  createMovie);

router.get('/', getMovies);

router.get('/:id', getMovieById);

router.put('/update/:id',upload.single('posterImage'),   updateMovie);

router.delete('/delete/:id',  deleteMovie);

module.exports = router;
