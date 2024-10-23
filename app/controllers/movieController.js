const path = require('path');
const movieService = require('../services/movieService');
const movieValidation = require('../utils/validations/movieValidation');
 const {uploadToMinIO} = require('../services/uploadService')




exports.createMovie = async (req, res) => {
  // Validate inputs (uncomment if you want to use validation)
  // const { error } = movieValidation.validateMovie(req.body);
  // if (error) {
  //   return res.status(400).json({ msg: error.details[0].message });
  // }
  
  try {
    const userId = req.user.id;

    const videoFile = req.files.videoUrl; 
    const videoUrl = await uploadToMinIO(videoFile[0]); 

    const imageFile = req.files.imageUrl; 
    const imageUrl = await uploadToMinIO(imageFile[0]);

   
    const savedMovie = await movieService.createMovie(userId, req.body, imageUrl,videoUrl);
    
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};




exports.getMovies = async (req, res) => {
  
  
  try {
    const userId = req.user.id;
  
    
    const movies = await movieService.getMovies(userId);
 
    
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

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

exports.updateMovie = async (req, res) => {

  
  const { error } = movieValidation.validateMovie(req.body);
  if (error) {
    
    
    return res.status(400).json({ msg: error.details[0].message });
  }
  console.log(req.user.id);
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
};

exports.rating = async (req, res) => {
  const { movieId, rating } = req.body;
  const userId = req.user.id; 

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({ message: 'Rating must be between 1 and 10' });
  }

  try {
    const updatedMovie = await movieService.addOrUpdateRating(movieId, userId, rating);
    return res.status(200).json({ message: 'Rating updated successfully', movie: updatedMovie });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating rating', error: error.message });
  }
};


exports.getmovieRelatedPublicById = async(req,res)=>{
  
   const movieId = req.params.id;
   try {
     const RelatedMovies = await movieService.getmovieRelatedPublicById(movieId);

   return res.status(200).json({ RelatedMovies });
   } catch (error) {
    return res.status(500).json({ message: 'cant get the related movies', error: error.message });

   }
  


}