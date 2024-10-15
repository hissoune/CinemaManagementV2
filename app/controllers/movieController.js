const path = require('path');
const movieService = require('../services/movieService');
const movieValidation = require('../utils/validations/movieValidation');

exports.createMovie = async (req, res) => {
  // const { error } = movieValidation.validateMovie(req.body);
  // if (error) {
  //   return res.status(400).json({ msg: error.details[0].message });
  // }
  try {
    const userId = req.user.id;
    const movieData = req.body;

    const posterImage = req.file ? req.file.filename : null;

    const savedMovie = await movieService.createMovie(userId, movieData, posterImage);
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all movies created by the logged-in user
exports.getMovies = async (req, res) => {
  try {
    const userId = req.user.id;
    const movies = await movieService.getMovies(userId);
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get a specific movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.id;
    const movie = await movieService.getMovieById(userId, movieId);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  const { error } = movieValidation.validateMovie(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const userId = req.user.id;
    const movieId = req.params.id;
    const updateData = req.body;

    const posterImage = req.file ? req.file.filename : null; // Updated to reflect the new structure
    const updatedMovie = await movieService.updateMovie(userId, movieId, { ...updateData, posterImage });

    if (!updatedMovie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.id;
    const result = await movieService.deleteMovie(userId, movieId);
    if (!result) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getmoviesPublic = async(req, res) => {
  try {
   
    const movies = await movieService.getmoviesPublic();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
exports.getmoviePublicById = async (req, res) => {
  const id = req.params.id;
  try {
        const movie = await movieService.getmoviePublicById(id);
        res.status(200).json(movie);
  } catch (error) {
     res.status(500).json({ msg: err.message });
  }
}