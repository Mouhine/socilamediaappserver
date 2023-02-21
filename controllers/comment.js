const Comment = require("../models/Comment");
const Like = require("../models/Like");
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
  const { commentId, userId } = req.body;
  try {
    const like = await Like.find({ commentId: commentId, userId: userId });
    const foundComment = await Comment.findById(commentId);
    if (like.length === 0) {
      await Like.create({ userId, commentId });
      foundComment.likes++;
      foundComment.save();
      res.status(201).send("liked comment successfully");
    }

    await Like.deleteOne({ userId: userId });
    foundComment.likes--;
    foundComment.save();
    res.status(200).send("dislike comment successfully");
  } catch (error) {}
};

module.exports = {
  addComment,
  getComments,
  likeComment,
  deletComment,
};
