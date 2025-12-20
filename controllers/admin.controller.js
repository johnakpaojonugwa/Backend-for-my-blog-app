import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, total: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', '-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, total: posts.length, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUserByAdmin = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Optionally remove user's posts
        await Post.deleteMany({ author: user._id });

        res.status(200).json({ success: true, message: 'User and their posts deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePostByAdmin = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
