const path = require('path');
const minioClient = require('../config/minioConfig');
const bucketName = 'videos';

const uploadToMinIO = (file) => {
    return new Promise((resolve, reject) => {
      const filePath = file.path;
  
      // Get the file extension
      const fileExtension = path.extname(file.originalname).toLowerCase();
  
      let uniqueFileName;
  
      // Check MIME type to determine if the file is an image or video
      if (file.mimetype.startsWith('image/')) {
        uniqueFileName = `image_${Date.now()}${fileExtension}`;
      } else if (file.mimetype.startsWith('video/')) {
        uniqueFileName = `video_${Date.now()}${fileExtension}`;
      } else {
        return reject(new Error('Unsupported file type: ' + file.mimetype));
      }
  
      // Upload to MinIO
      minioClient.fPutObject(bucketName, uniqueFileName, filePath, (err, etag) => {
        if (err) {
          return reject(err);
        }
  
        const fileUrl = `http://127.0.0.1:9000/${bucketName}/${uniqueFileName}`;
        resolve(fileUrl);
      });
    });
  };
  

module.exports = { uploadToMinIO };
