import Comment from '../models/comment.model.js';

export const addComment = async (req, res) => {
    const comment = await Comment.create({ 
        post: req.params.postId,
        user: req.user.id,
        text: req.body.text
    });
    res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
}

export const getPostComments = async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('user', 'username email').sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: comments.length, data: comments });
}

