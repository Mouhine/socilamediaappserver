const express = require("express");
const {
  getPost,
  updatePost,
  deletPost,
  addPost,
  getPosts,
  likePost,
  deslikePost,
  serchPosts,
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
postRout.route("/:id/deslike").patch(verifyJWT, deslikePost);
postRout.route("/search").post(serchPosts);
module.exports = postRout;
