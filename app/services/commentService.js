const Comment = require('../models/Comment'); 


exports.createComment = async ({ movieId, userId, content }) => {
  try {
    const newComment = new Comment({
      movie: movieId,
      user: userId,
      content
    });

    await newComment.save();
    return newComment;
  } catch (err) {
    throw new Error('Error creating comment: ' + err.message);
  }
};

exports.getCommentsByMovie = async (movieId) => {
  try {
    const comments = await Comment.find({ movie: movieId })
    .populate({
        path: 'user',
        select: 'name email image'
      })
      .sort({ createdAt: -1 });
    
    return comments;
  } catch (err) {
    throw new Error('Error fetching comments: ' + err.message);
  }
};

exports.deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    await comment.remove();
  } catch (err) {
    throw new Error('Error deleting comment: ' + err.message);
  }
};
