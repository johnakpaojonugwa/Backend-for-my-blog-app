import mongoose from "mongoose";

const postSchema = new mongoose.Schema ({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    backCover: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;





// import mongoose from "mongoose";
// import slugify from "slugify";

// const commentSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   content: { type: String, required: true }
// }, { timestamps: true });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   slug: { type: String, unique: true },

//   content: { type: String, required: true },

//   coverImage: String,

//   tags: [{
//     type: String,
//     lowercase: true,
//     trim: true
//   }],

//   readingTime: Number,

//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   comments: [commentSchema],

//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
// }, { timestamps: true });

// /* Auto-generate slug + reading time */
// postSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }

//   const words = this.content.split(/\s+/).length;
//   this.readingTime = Math.ceil(words / 200); // DEV uses ~200 wpm

//   next();
// });

// export default mongoose.model("Post", postSchema);

