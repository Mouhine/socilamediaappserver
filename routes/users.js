const express = require("express");
const {
  getUsers,
  getUser,
  addToReadingList,
  getUserPosts,
  followUser,
  deleteFromReadingList,
  updateUser,
  getFollowers,
  unfollowUser,
} = require("../controllers/users");
const verifyJWT = require("../middleware/verifyJWT");
const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:id/posts").get(getUserPosts);
usersRouter.route("/:id").get(getUser);
usersRouter.route("/:id").put(updateUser);
usersRouter.route("/:id").post(verifyJWT, addToReadingList);
usersRouter.route("/:id").delete(verifyJWT, deleteFromReadingList);
usersRouter.route("/:id/follow").post(followUser);
usersRouter.route("/:id/unfollow").post(unfollowUser);
usersRouter.route("/:id/followers").get(getFollowers);
module.exports = usersRouter;
