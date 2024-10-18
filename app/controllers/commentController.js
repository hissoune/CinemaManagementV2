const commentService = require('../services/commentService'); 

exports.createComment = async (req, res) => {
  try {
    const { movieId, content } = req.body; 
    const userId = req.user.id;
          console.log(req.body);
          
    if (!movieId || !content) {
      return res.status(400).json({ msg: 'Movie ID and content are required' });
    }

    const comment = await commentService.createComment({ movieId, userId, content });
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getCommentsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await commentService.getCommentsByMovie(movieId);
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId, req.user.id);
    res.status(200).json({ success: true, msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
