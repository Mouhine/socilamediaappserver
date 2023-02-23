const { default: mongoose } = require("mongoose");
const { findOneAndUpdate } = require("../models/Post");
const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const getPost = async (req, res) => {
  const { id } = req.params;
  console.log(id);
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
    const posts = await Post.find();

    if (!posts)
      res
        .status(403)
        .json({ success: false, message: "coulde not find the posts" });

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
    await Like.deleteMany({ postId: id });
    await Comment.deleteMany({ belong_to: id });
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
    const like = await Like.find({ postId: id, userId: req.body.userId });

    if (like.length === 0) {
      const like = await Like.create({
        userId: req.body.userId,
        postId: id,
      });
      const foundPost = await Post.findById(id);
      foundPost.likes++;
      foundPost.likedBy.push(req.body.userId);
      await foundPost.save();
      console.log(foundPost);
      return res.status(201).send("liked post successfully");
    }

    await Like.deleteOne({ postId: id });

    const foundPost = await Post.findById(id);
    if (foundPost.likes === 0) {
      return res.status(204).send("you cant deslike this post anymore");
    }
    foundPost.likes--;
    const filtredLikes = foundPost.likedBy.filter(
      (userId) => userId !== req.body.userId
    );

    foundPost.likedBy = [...filtredLikes];
    await foundPost.save();
    console.log(foundPost);
    res.status(200).send("desliksed post successfully");
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

const isLikedByMe = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const like = await Like.find({ userId: userId, postId: postId });
    console.log(like[0]);
    if (like[0]) {
      return res.status(200).send({
        likedByMe: true,
      });
    }
    res.status(200).send({
      likedByMe: false,
    });
  } catch (error) {}
};

module.exports = {
  getPost,
  getPosts,
  deletPost,
  updatePost,
  addPost,
  likePost,
  serchPosts,
  isLikedByMe,
};
