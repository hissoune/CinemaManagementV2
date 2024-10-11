const Movie = require('../models/Movie');
const User = require('../models/User');
const Session = require('../models/Session');
const path = require('path');

// Create a new movie
exports.createMovie = async (userId, movieData, posterImage) => {
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
    posterImage: posterImage,
    creator: userId,
  });

  return await newMovie.save();
};

exports.getMovies = async (userId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const movies = await Movie.find({ creator: userExists._id });
  const basePath = 'http://localhost:3000/uploads/'; 

  const moviesWithFullImagePath = movies.map(movie => ({
    ...movie._doc,
    posterImage: movie.posterImage
      ? `${basePath}${movie.posterImage.split(path.sep).join('/')}` 
      : null,
  }));

  return moviesWithFullImagePath; 
};

exports.getMovieById = async (userId, movieId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const movie = await Movie.findOne({ _id: movieId, creator: userId });
  if (!movie) {
    throw new Error('Movie not found');
  }

  const movieWithFullImagePath = {
    ...movie._doc,
    posterImage: movie.posterImage
      ? `http://localhost:3000/uploads/${movie.posterImage.split(path.sep).join('/')}` 
      : null,
  };

  return movieWithFullImagePath;
};

exports.updateMovie = async (userId, movieId, updateData) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const movie = await Movie.findOne({ _id: movieId, creator: userId });
  if (!movie) {
    throw new Error('Movie not found');
  }

  Object.assign(movie, updateData);
  return await movie.save();
};

exports.deleteMovie = async (userId, movieId) => {
  const movie = await Movie.findOne({ _id: movieId, creator: userId });
  if (!movie) {
    throw new Error('Movie not found or you are not the creator');
  }
  
  const session = await Session.find({ movie: movieId });
  if (session.length > 0) {
    throw new Error('Movie has a Session');
  }

  await Movie.findByIdAndUpdate(movieId, { isDeleted: true });
  return { msg: 'Movie deleted successfully' };
};

exports.getmoviesPublic = async () => {
    const movies = await Movie.find();
  const basePath = 'http://localhost:3000/uploads/'; 

  const moviesWithFullImagePath = movies.map(movie => ({
    ...movie._doc,
    posterImage: movie.posterImage
      ? `${basePath}${movie.posterImage.split(path.sep).join('/')}` 
      : null,
  }));

  return moviesWithFullImagePath; 
}

exports.getmoviePublicById = async (id) => {
  const movie = await Movie.findById(id);
   if (!movie) {
    return null;
  }
  const basePath = 'http://localhost:3000/uploads/'; 
  
   const movieWithFullImagePath = {
    ...movie._doc,
    posterImage: movie.posterImage
      ? `${basePath}${movie.posterImage.split(path.sep).join('/')}`
      : null,
  };

  return movieWithFullImagePath; 

}