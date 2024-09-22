const Movie = require('../models/Movie');

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const { title, description,releaseDate, genre, duration, rating} = req.body;

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
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

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

    // Find the movie by ID and update its details
    let movie = await Movie.findById(req.params.id);
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
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    res.status(200).json({ msg: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
