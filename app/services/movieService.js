const Movie = require('../models/Movie');
const User = require('../models/User');

// Create a new movie
exports.createMovie = async (userId, movieData) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const { title, description, releaseDate, genre, duration, rating } = movieData;
  if (!title || !description || !genre || !rating || !duration) {
    throw new Error('Please provide all required fields');
  }

  const newMovie = new Movie({
    ...movieData,
    creator: userId,
  });

  return await newMovie.save();
};

// Get all movies created by a user
exports.getMovies = async (userId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }
  
  return await Movie.find({ creator: userExists._id });
};

// Get a movie by its ID and ensure the user is the creator
exports.getMovieById = async (userId, movieId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const movie = await Movie.findOne({ _id: movieId, creator: userId });
  if (!movie) {
    throw new Error('Movie not found');
  }

  return movie;
};

// Update a movie
exports.updateMovie = async (userId, movieId, updateData) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const movie = await Movie.findOne({ _id: movieId, creator: userId });
  if (!movie) {
    throw new Error('Movie not found');
  }

  Object.assign(movie, updateData); // Merge new data with the existing movie object
  return await movie.save();
};

// Delete a movie
exports.deleteMovie = async (userId, movieId) => {
  const movie = await Movie.findOne({ _id: movieId, creator: userId });
  if (!movie) {
    throw new Error('Movie not found or you are not the creator');
  }

  await Movie.findByIdAndDelete(movieId);
  return { msg: 'Movie deleted successfully' };
};
