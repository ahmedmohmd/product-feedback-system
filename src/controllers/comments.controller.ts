import Comment from "../models/comment.model";
import Feedback from "../models/feedback.model";

const getComments = async ({ params }, res) => {
  try {
    const { feedbackId } = params;

    const comments = await Comment.find({
      feedback: feedbackId,
    }).populate("owner");

    res.status(200).json(comments);
  } catch (error) {
    console.error("An error occurred!");
  }
};

const getSingleComment = async ({ params }, res) => {
  try {
    const { feedbackId, commentId } = params;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
    });

    if (!targetComment) {
      return res
        .status(404)
        .json({ message: "Comment not found!" })
        .populate("owner");
    }

    res.status(200).json(targetComment);
  } catch (error) {
    console.error("An error occurred!");
  }
};

const postComment = async ({ body, params }, res) => {
  try {
    const { content } = body;
    const { feedbackId } = params;

    const newComment = await Comment.create({ content, feedback: feedbackId });

    await Feedback.findByIdAndUpdate(
      feedbackId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(201).json(newComment);
  } catch (error) {
    console.error("An error occurred!");
  }
};

const patchComment = async ({ body, params }, res) => {
  try {
    const { feedbackId, commentId } = params;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
    });

    if (!targetComment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    for (let field in body) {
      if (field) {
        targetComment[field] = body[field];
      }
    }

    await targetComment.save();

    res.status(201).json(targetComment);
  } catch (error) {
    console.error("An error occurred!");
  }
};

const deleteComment = async ({ params }, res) => {
  try {
    const { feedbackId, commentId } = params;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
    });

    if (!targetComment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    await Comment.deleteOne({
      _id: commentId,
      feedback: feedbackId,
    });

    res.status(200).json({
      message: "comment is deleted successfully",
    });
  } catch (error) {
    console.error("An error occurred!");
  }
};

export default {
  getComments,
  getSingleComment,
  postComment,
  patchComment,
  deleteComment,
};
