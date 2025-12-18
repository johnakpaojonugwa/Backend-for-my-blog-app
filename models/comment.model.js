import mongoose from "mongoose";

const commentSchema = new mongoose.Schema ({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },

}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;