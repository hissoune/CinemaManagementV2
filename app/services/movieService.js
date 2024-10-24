const Movie = require('../models/Movie');
const User = require('../models/User');
const Session = require('../models/Session');
const path = require('path');

// Create a new movie
exports.createMovie = async (userId, movieData, imageUrl,videoUrl) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  const { title, description, releaseDate, genre, duration } = movieData;
  if (!title || !description || !genre || !duration) {
    throw new Error('Please provide all required fields');
  }

  const newMovie = new Movie({
    ...movieData,
    posterImage: imageUrl,
    videoUrl:videoUrl,
    creator: userId,
  });

  return await newMovie.save();
};

exports.getMovies = async (userId) => {

  const userExists = await User.findById(userId);

  
  if (!userExists) {
    throw new Error('User not found');
  }

  const movies = await Movie.find({creator:userId});


  return movies; 
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

  const updatedMovie = await Movie.findOneAndUpdate(
    { _id: movieId, creator: userId },  
    updateData,                        
    { new: true }  
  );
  return updatedMovie;
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


  return movies; 
}

exports.getmoviePublicById = async (id) => {
  const movie = await Movie.findById(id);
   if (!movie) {
    return null;
  }


  return movie; 

};


exports.addOrUpdateRating = async (movieId, userId, rating) => {
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new Error('Movie not found');
  }

  const existingRating = movie.ratings.find((r) => r.userId.toString() === userId);

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    movie.ratings.push({ userId, rating });
    movie.ratingCount += 1;
  }
  const totalRating = movie.ratings.reduce((acc, cur) => acc + cur.rating, 0);
  movie.averageRating = totalRating / movie.ratings.length;

  const updatedMovie = await movie.save();

  return updatedMovie;
};

exports.getmovieRelatedPublicById = async (movieId) => {
  const movie = await Movie.findById(movieId);
  if (!movie) {
      throw new Error('Movie not found');
  }

  const { title, releaseDate, creator, genre } = movie;

  const relatedMovies = await Movie.find({
    $or: [
        { title: { $regex: title, $options: 'i' } }, 
        {
            releaseDate: {
                $gte: new Date(releaseDate - 1 * 24 * 60 * 60 * 1000), 
                $lte: new Date(releaseDate + 1 * 24 * 60 * 60 * 1000) 
            }
        }, 
        { creator }, 
        { genre: { $in: genre } } 
    ],
    _id: { $ne: movieId } 
  }); 

  return relatedMovies;
};

