import Comment from "../models/comment.model";
import Feedback from "../models/feedback.model";

const getComments = async ({ params, session }, response, next) => {
  try {
    const { feedbackId } = params;
    const { user } = session;

    const comments = await Comment.find({
      feedback: feedbackId,
      author: user.id,
    }).populate("author", "name");

    response.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const getSingleComment = async ({ params, session }, response, next) => {
  try {
    const { feedbackId, commentId } = params;
    const { user } = session;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
      author: user.id,
    });

    if (!targetComment) {
      return response
        .status(404)
        .json({ message: "Comment not found!" })
        .populate("owner");
    }

    response.status(200).json(targetComment);
  } catch (error) {
    next(error);
  }
};

const postComment = async ({ body, params, session }, response, next) => {
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

    response.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

const patchComment = async ({ body, params, session }, response, next) => {
  try {
    const { feedbackId, commentId } = params;
    const { user } = session;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
      author: user.id,
    });

    if (!targetComment) {
      return response.status(404).json({ message: "Comment not found!" });
    }

    for (let field in body) {
      if (field) {
        targetComment[field] = body[field];
      }
    }

    await targetComment.save();

    response.status(201).json(targetComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async ({ params, session }, response, next) => {
  try {
    const { feedbackId, commentId } = params;
    const { user } = session;

    const targetComment = await Comment.findOne({
      _id: commentId,
      feedback: feedbackId,
      author: user.id,
    });

    if (!targetComment) {
      return response.status(404).json({ message: "Comment not found!" });
    }

    await Comment.deleteOne({
      _id: commentId,
      feedback: feedbackId,
    });

    response.status(204).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getComments,
  getSingleComment,
  postComment,
  patchComment,
  deleteComment,
};
