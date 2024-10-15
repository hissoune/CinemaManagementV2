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
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0, 
  }, 
  ratingCount: {
    type: Number,
    default: 0, 
  }, 
  posterImage: {
    type: String,  
  },
  videoUrl: {
    type: String,  
   
  },
  isPublic: {
    type: Boolean,
    default: true, 
  },
  isScheduled: {
    type: Boolean,
    default: false, 
  },
  scheduleDate: {
    type: Date,
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
