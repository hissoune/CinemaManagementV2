const Joi = require('joi');

const movieSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  
  description: Joi.string().min(10).max(500).required(),
  
  releaseDate: Joi.date().required(),
  
  genre: Joi.string().valid('Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi').required(),
    duration: Joi.number().min(1).max(5).required(),
    rating:Joi.number().min(1).max(10),
});

 exports.validateMovie = (movieData) => {
  return movieSchema.validate(movieData, { abortEarly: false });
};

