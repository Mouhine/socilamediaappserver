const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const Follower = require("../models/Follower");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "user ID required." });

  try {
    const user = await User.find({ _id: req?.params?.id }).exec();

    res.status(200).json({
      error: false,
      message: "get user successfull",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "server error something went wrong",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().exec();
    if (!users) res.status(204).json({ message: "No users found." });
    res.status(200).json({
      error: false,
      message: "get all the users",
      users: users,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "somthing went wrong " });
  }
};

const deletUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required." });
  try {
    const foundUser = await User.findOne({ _id: req.params.id }).exec();
    if (!foundUser) {
      return res
        .status(204)
        .json({ message: `No user matches ID ${req.params.id}.` });
    }
    await foundUser.deleteOne(); //{ _id: req.body.id }
    await Like.deleteMany({ userId: req?.params?.id });
    await Post.deleteMany({ "author.id": req?.params?.id });
    await Comment.deleteMany({ "author.id": req?.params?.id });
    res.status(200).send("user deleted successfully");
  } catch (error) {
    res.status(500).send("server error");
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await User.updateOne({ _id: id }, { ...req.body });
    if (!res) {
      return res.status(404).send("the user does not exist");
    }

    res.status(200).send("update user succesfully");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const addToReadingList = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required." });
  if (!mongoose.Types.ObjectId.isValid(req?.params?.id))
    return res.status(404).send(`No post with id: ${req?.params?.id}`);

  const foundUser = await User.findOne({ _id: req.params.id }).exec();

  if (!foundUser) {
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.params.id}.` });
  }
  try {
    const isFound = foundUser.reading_list.some(
      (element) => element.title === req.body.title
    );
    console.log(isFound);

    if (isFound) {
      return res.status(200).json({
        success: true,
        message: "this post already exist",
      });
    }
    foundUser.reading_list.push(req.body);

    await foundUser.save();
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteFromReadingList = async (req, res) => {
  console.log(req.params.userId);
  const foundUser = await User.find({ _id: req.params.userId }).exec();
  console.log(foundUser.reading_list);
  if (!foundUser) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}.` });
  }

  try {
    const isFound = foundUser[0].reading_list.filter(
      (element) => element.date !== req.body.filter
    );

    console.log(isFound);

    foundUser[0].reading_list = [...isFound];
    await foundUser[0].save();
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required." });
  if (!mongoose.Types.ObjectId.isValid(req?.params?.id))
    return res.status(404).send(`No post with id: ${req?.params?.id}`);

  try {
    const posts = await Post.find({
      "author.id": req.params.id,
    });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    await Follower.create(req.body);
    const foundUser = await User.findById(req.body.id);
    foundUser.followers.push(req.body.following_by);
    await foundUser.save();
    res.status(201).json({
      success: true,
      message: "following user successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const unfollowUser = async (req, res) => {
  console.log("unfollow user");
  const { id, followerId } = req.body;
  try {
    await Follower.deleteOne({ id: id });
    const foundUser = await User.findById(req.body.id);
    const idd = foundUser.followers.filter((f) => f !== req.body.followerId);
    console.log(idd);
    foundUser.followers = idd;
    await foundUser.save();
    res.status(201).json({
      success: true,
      message: "unfollowing user successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const followers = await Follower.find({ following_by: req.params.id });
    if (!followers) {
      return res.send("there is no followers");
    }
    res.send({ followers });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deletUser,
  addToReadingList,
  getUserPosts,
  followUser,
  deleteFromReadingList,
  getFollowers,
  unfollowUser,
  deletUser,
};
