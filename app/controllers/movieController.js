const movieService = require('../services/movieService');
const movieValidation = require('../utils/validations/movieValidation')
exports.createMovie = async (req, res) => {
   const { error } = movieValidation.validateMovie(req.body);
  if (error) {
   return  res.status(400).json(error.details[0].message)
  }
  try {
    const userId = req.user.id;
    const movieData = req.body;
        
    const posterImage = req.file ? req.file.path : null;

    const savedMovie = await movieService.createMovie(userId, movieData,posterImage);
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
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  const { error } = movieValidation.validateMovie(req.body);
  if (error) {
   return  res.status(400).json(error.details[0].message)
  }
  try {
    const userId = req.user.id;
    const movieId = req.params.id;
    const updateData = req.body;
    const updatedMovie = await movieService.updateMovie(userId, movieId, updateData);
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
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
