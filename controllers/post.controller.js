import Post from "../models/post.model.js"

export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;

  const coverImage =
    req.files?.coverImage?.[0]?.path || "";

  const post = await Post.create({
    title,
    content,
    tags: JSON.parse(tags),
    coverImage,
    author: req.user._id
  });

  res.status(201).json(post);
};


export const getAllPosts = async (req, res) => {
    const posts = await Post.find().populate('author', '-password').sort({ createdAt: -1 });
    res.status(201).json({ success: true, total: posts.length, data: posts });
}

export const getMyPosts = async (req, res) => {
    const posts = await Post.find({ author: req.user.id });
    res.status(200).json({ success: true, posts });
}

export const deletePost = async (req, res) => {
    const posts = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!posts) {
        return res.status(404).json({ success: false, message: "Post not found or unauthorized" });
    }
    res.status(200).json({ success: true, message: "Post deleted successfully" });
}

export const likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.dislikes.pull(req.user.id);
    post.likes.addToSet(req.user.id);
    await post.save();
    res.status(200).json({ success: true, message: "Post liked", post });
}

export const dislikePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.likes.pull(req.user.id);
    post.dislikes.addToSet(req.user.id);
    await post.save();
    res.status(200).json({ success: true, message: "Post disliked", post });
}