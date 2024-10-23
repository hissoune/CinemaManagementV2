const express = require('express');
const { createMovie, getMovies, getMovieById, updateMovie,rating, deleteMovie,getmovieRelatedPublicById } = require('../controllers/movieController');
const upload = require('../midlwares/multerSetup');

const router = express.Router();

router.post('/movies/create',upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]),  createMovie);


router.get('/movies/', getMovies);
router.put('/rating',rating );

router.get('/movies/:id', getMovieById);
router.get('/relatedMovies/:id', getmovieRelatedPublicById);

router.put('/movies/update/:id',upload.single('posterImage'),   updateMovie);

router.delete('/movies/delete/:id',  deleteMovie);

module.exports = router;
