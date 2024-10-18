const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController'); 
const upload = require('../midlwares/multerSetup');

router.post('/comments',upload.none(), commentController.createComment);

router.get('/comments/movie/:movieId', commentController.getCommentsByMovie);

router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;
