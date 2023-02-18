const { default: mongoose } = require("mongoose");
const { findOneAndUpdate } = require("../models/Post");
const Post = require("../models/Post");
const User = require("../models/User");
const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) res.status(401).json({ success: false, message: "invalid id" });
    const post = await Post.findById(id);
    if (!post)
      res
        .status(500)
        .json({ success: false, message: "coulde not find the post" });
    res
      .status(200)
      .json({ success: true, message: "request successfull", post });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().exec();
    if (!posts)
      res
        .status(403)
        .json({ success: false, message: "coulde not find the post" });

    res.status(200).json({
      success: true,
      message: "request successfull",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const addPost = async (req, res) => {
  try {
    if (!req.body)
      res.status(401).json({
        success: false,
        message: "bad request",
      });
    await Post.create(req.body);
    res.status(200).json({
      success: true,
      message: "request successfull",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updatePost = async (req, res) => {
  const post = { ...req.body };
  try {
    if (!post)
      res.status(401).json({
        success: false,
        message: "bad request",
      });
    await Post.updateOne({ _id: id }, { ...post });
    res.status(200).json({
      success: true,
      message: "request successfull",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deletPost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id)
      return res.status(401).json({
        success: false,
        message: "bad request",
      });
    const foundPost = await Post.findById({ _id: id });
    const result = foundPost.deleteOne();
    res.status(200).json({
      success: true,
      message: "request successfull",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const likePost = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!mongoose.Types.ObjectId.isValid(id))
    //   return res.status(404).send(`No post with id: ${id}`);
    const foundPost = await Post.find({ _id: id });
    foundPost[0].meta.favs++;
    foundPost[0].save();

    res.status(200).json({
      foundPost: foundPost[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deslikePost = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!mongoose.Types.ObjectId.isValid(id))
    //   return res.status(404).send(`No post with id: ${id}`);
    const foundPost = await Post.find({ _id: id });
    foundPost[0].meta.favs--;
    foundPost[0].save();

    res.status(200).json({
      foundPost: foundPost[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const serchPosts = async (req, res) => {
  try {
    const posts = await Post.find({ $text: { $search: req.body.input } });
    res.send(posts);
  } catch (error) {}
};

module.exports = {
  getPost,
  getPosts,
  deletPost,
  updatePost,
  addPost,
  likePost,
  deslikePost,
  serchPosts,
};
