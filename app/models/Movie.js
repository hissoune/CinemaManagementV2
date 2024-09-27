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
    type: [String],  
    required: true,  
  },
  duration: {
    type: Number, 
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required:true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  posterImage: {
    type: String,  // Path to the uploaded image file
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

MovieSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model('Movie', MovieSchema);
