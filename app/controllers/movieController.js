const Movie = require('../models/Movie');
const User = require('../models/User');

exports.createMovie = async (req, res) => {
  try {
    const { title, description,releaseDate, genre, duration, rating} = req.body;


    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (!title || !description || !genre ||  !rating || !duration) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newMovie = new Movie({
      title,
      description,
      genre,
      releaseDate,
      duration,
      rating,
      creator:userId,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getMovies = async (req, res) => {
  try {
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const movies = await Movie.find({creator:userExists._id});
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
     const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const movie = await Movie.findOne({ _id: req.params.id, creator: userId });

    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
     const { title, description,releaseDate, genre, duration, rating} = req.body;
     
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const movie = await Movie.findOne({ _id: req.params.id, creator: userId });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.genre = genre || movie.genre;
    movie.rating = rating || movie.rating;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.duration = duration || movie.duration;

    const updatedMovie = await movie.save();
    res.status(200).json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const userId = req.user.id; 

    const movie = await Movie.findOne({ _id: req.params.id, creator: userId });

    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found or you are not the creator' });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
