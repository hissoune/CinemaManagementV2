const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController'); 

router.post('/comments', commentController.createComment);

router.get('/comments/movie/:movieId', commentController.getCommentsByMovie);

router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;
