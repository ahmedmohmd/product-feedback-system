import Comment from "../models/comment.model";
import Feedback from "../models/feedback.model";

const getComments = async ({ params, session }, res) => {
  try {
    const { feedbackId } = params;
    const { user } = session;

    const comments = await Comment.find({
      feedback: feedbackId,
      author: user.id,
    }).populate("author", "name");

    res.status(200).json(comments);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const getSingleComment = async ({ params, session }, res) => {
  try {
    const { feedbackId, commentId } = params;
    const { user } = session;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
      author: user.id,
    });

    if (!targetComment) {
      return res
        .status(404)
        .json({ message: "Comment not found!" })
        .populate("owner");
    }

    res.status(200).json(targetComment);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const postComment = async ({ body, params, session }, res) => {
  try {
    const { content } = body;
    const { feedbackId } = params;
    const { user } = session;

    const newComment = await Comment.create({
      content,
      feedback: feedbackId,
      author: user.id,
    });

    await Feedback.findByIdAndUpdate(
      feedbackId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(201).json(newComment);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const patchComment = async ({ body, params, session }, res) => {
  try {
    const { feedbackId, commentId } = params;
    const { user } = session;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
      author: user.id,
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
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const deleteComment = async ({ params, session }, res) => {
  try {
    const { feedbackId, commentId } = params;
    const { user } = session;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
      author: user.id,
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
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

export default {
  getComments,
  getSingleComment,
  postComment,
  patchComment,
  deleteComment,
};
