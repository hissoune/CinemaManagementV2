const Movie = require('../models/Movie');
const User = require('../models/User');
const Session = require('../models/Session');

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

exports.getMovies = async (userId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }
  
  return await Movie.find({ creator: userExists._id });
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

  return movie;
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
   const session = await Session.find({ movie: movieId});
  if (session.length>0) {
        throw new Error('Movie have a Session');

  }

  await Movie.findByIdAndUpdate(movieId,{isDeleted:true});
  return { msg: 'Movie deleted successfully' };
};
