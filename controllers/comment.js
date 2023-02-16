const Comment = require("../models/Comment");
const getComments = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({
      success: false,
      message: "post id required",
    });
  }
  try {
    const comments = await Comment.find({ belong_to: req.params.id });
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const addComment = async (req, res) => {
  const comment = req.body;
  try {
    await Comment.create(comment);
    res.status(201).json({
      success: true,
      message: "create commets successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateComment = async (res, req) => {};
const deletComment = async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "delete commets successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const likeComment = async (req, res) => {
  const { id } = req.body;

  try {
    const foundComment = await Comment.findById(id);
    foundComment.meta.likes++;
    foundComment.save();
    res.status(201).json({
      success: true,
      message: "liked comment successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const dislikeComment = async (req, res) => {
  const { id } = req.body;

  try {
    const foundComment = await Comment.findById(id);
    foundComment.meta.deslikes++;
    foundComment.save();
    res.status(201).json({
      success: true,
      message: "liked comment successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addComment,
  getComments,
  likeComment,
  dislikeComment,
  deletComment,
};
