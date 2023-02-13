const mongoose = require("mongoose");
const { Schema } = mongoose;
const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
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
  meta: {
    votes: Number,
    favs: Number,
  },
  cover: String,
  tags: [
    {
      id: String,
      body: String,
    },
  ],
});

const Post = mongoose.model("Post", blogSchema);
module.exports = Post;
