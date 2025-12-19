import Comment from '../models/comment.model.js';

export const addComment = async (req, res) => {
    try {
        const { text } = req.body || {};
        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }
        const comment = await Comment.create({ 
            post: req.params.postId,
            user: req.user.id,
            text
        });
        res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ success: false, message: "Post ID is required" });
        }
        const comments = await Comment.find({ post: postId }).populate('user', 'username email').sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

