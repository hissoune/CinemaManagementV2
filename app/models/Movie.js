const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
  },
  duration: {
    type: Number, 
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
