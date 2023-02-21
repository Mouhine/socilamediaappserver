const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: {
    id: String,
    profile: String,
    firstName: String,
    lastName: String,
  },
  body: String,
  belong_to: String,
  likes: Number,
});

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
