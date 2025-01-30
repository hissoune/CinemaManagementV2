const path = require('path');
const minioClient = require('../config/minioConfig');
const bucketName = 'videos';

const uploadToMinIO = (file, isAnX) => {
    return new Promise((resolve, reject) => {
      const filePath = file.path;
  
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      let uniqueFileName;
      

  

      if (file.mimetype.startsWith('image/') && isAnX == 'image' ) {
        uniqueFileName = `image_${Date.now()}${fileExtension}`;

      } else if (file.mimetype.startsWith('video/') && isAnX == 'video' ) {
       
         

        uniqueFileName = `video_${Date.now()}${fileExtension}`;
      } else {
        return reject(new Error('Unsupported file type: ' + file.mimetype));
      }
  
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
