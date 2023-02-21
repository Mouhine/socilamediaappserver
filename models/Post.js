const mongoose = require("mongoose");
const Like = require("./Like");
const { Schema } = mongoose;
const blogSchema = new Schema({
  title: {
    type: String,
  }, // String is shorthand for {type: String}
  author: {
    id: String,
    firstName: String,
    lastName: String,
    job: String,
    profile: String,
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  body: String,
  date: { type: Date, default: Date.now },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [String],
  cover: String,
  tags: [
    {
      id: String,
      body: String,
    },
  ],
});
blogSchema.index({ title: "text" });
const Post = mongoose.model("Post", blogSchema);
module.exports = Post;
