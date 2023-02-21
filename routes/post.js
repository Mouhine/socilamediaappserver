const express = require("express");
const {
  getPost,
  updatePost,
  deletPost,
  addPost,
  getPosts,
  likePost,

  serchPosts,
  isLikedByMe,
} = require("../controllers/post");
const verifyJWT = require("../middleware/verifyJWT");
const postRout = express.Router();

postRout.route("/").post(verifyJWT, addPost).get(getPosts);
postRout
  .route("/:id")
  .get(getPost)
  .patch(verifyJWT, likePost)
  .put(verifyJWT, updatePost)
  .delete(verifyJWT, deletPost);
postRout.route("/search").post(serchPosts);
postRout.route("/islikedbyme").post(verifyJWT, isLikedByMe);
module.exports = postRout;
