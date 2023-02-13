const express = require("express");
const commentRouter = express.Router();
const CommentHandller = require("../controllers/comment");
const verifyJWT = require("../middleware/verifyJWT");

commentRouter
  .route("/:id")
  .get(CommentHandller.getComments)
  .post(verifyJWT, CommentHandller.addComment)
  .delete(verifyJWT, CommentHandller.deletComment);
commentRouter.patch("/:id/like", CommentHandller.likeComment);
commentRouter.patch("/:id/dislike", CommentHandller.dislikeComment);
module.exports = commentRouter;
