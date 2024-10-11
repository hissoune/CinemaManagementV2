const multer = require('multer');
const path = require('path');

// Set up storage with the new uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Updated to point to the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Keep the original extension
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Allowed file types
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error('Images only!')); // Reject the file
  }
};

// Create the multer instance with storage settings, file filter, and size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

module.exports = upload;
