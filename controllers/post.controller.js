import Post from "../models/post.model.js";

/// CREATE NEW POST
export const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body || {};

        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        const backCover = req.files?.backCover?.[0]?.path || null;

        // Clean tags
        const rawTags = Array.isArray(tags)
            ? tags
            : tags
                ? tags.split(",")
                : [];
        const cleanTags = [...new Set(rawTags
            .map((tag) => tag?.trim())
            .filter((tag) => tag && tag !== "undefined")
        )];

        const post = await Post.create({
            title,
            content,
            tags: cleanTags,
            backCover,
            author: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate("author", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: posts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET LOGGED-IN USER'S POSTS
export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id, isDeleted: false })
            .populate("author", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: posts.length,
            posts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// GET SINGLE POST BY ID
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findOne({
            _id: id,
            isDeleted: false
        }).populate("author", "-password");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or has been removed",
            });
        }

        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate({
            _id: req.params.id,
            author: req.user.id,
            isDeleted: false
        }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }, { new: true }
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found, already deleted, or unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            message: "Post moved to trash successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// LIKE POST
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.dislikes.pull(req.user.id);
        post.likes.addToSet(req.user.id);

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post liked",
            likes: post.likes.length,
            dislikes: post.dislikes.length,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DISLIKE POST
export const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.likes.pull(req.user.id);
        post.dislikes.addToSet(req.user.id);

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post disliked",
            likes: post.likes.length,
            dislikes: post.dislikes.length,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all soft-deleted posts for the logged-in user
export const getMyTrash = async (req, res) => {
    try {
        const posts = await Post.find({
            author: req.user.id,
            isDeleted: true
        }).sort({ deletedAt: -1 });

        res.status(200).json({
            success: true,
            total: posts.length,
            posts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Restore a soft-deleted post
export const restorePost = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.user.id, isDeleted: true },
            { $set: { isDeleted: false, deletedAt: null } },
            { new: true }
        );

        if (!post) return res.status(404).json({ success: false, message: "Post not found in trash" });

        res.status(200).json({ success: true, message: "Post restored successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Permanent delete from the trash 
export const permanentDelete = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            author: req.user.id,
            isDeleted: true
        });

        if (!post) return res.status(404).json({ success: false, message: "Post not found in trash" });

        res.status(200).json({ success: true, message: "Post permanently erased" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};