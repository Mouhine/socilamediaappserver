const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LikeShema = new Schema({
  userId: String,
  postId: String,
  commentId: String,
});

const Like = mongoose.model("Likes", LikeShema);

module.exports = Like;
