import Feedback from "../models/feedback.model";

const getFeedbacks = async ({ user, query }, response, next) => {
  try {
    const { page = 1 } = query;

    const ITEMS_PER_PAGE = 10;
    const countFeedbacks = await Feedback.countDocuments({ owner: user.id });

    await Feedback.find({ owner: user.id })
      .skip(ITEMS_PER_PAGE * (page - 1))
      .limit(ITEMS_PER_PAGE)
      .populate("comments")
      .then((feedbacks) => {
        response.status(200).json({
          data: feedbacks,
          next: page * ITEMS_PER_PAGE < countFeedbacks,
          previous: page > 1,
        });
      });
  } catch (error) {
    next(error);
  }
};

const getSingleFeedback = async ({ params, user }, response, next) => {
  try {
    const { feedbackId } = params;

    const targetFeedback = await Feedback.findOne({
      _id: feedbackId,
      owner: user.id,
    }).populate("comments");

    if (targetFeedback) {
      return response.status(200).json(targetFeedback);
    }

    response.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    next(error);
  }
};

const postFeedback = async ({ body, user }, response, next) => {
  try {
    const { title, description, roadmap, categories } = body;
    const newTags = categories;

    const newFeedback = await Feedback.create({
      title,
      description,
      roadmap,
      categories: newTags,
      owner: user.id,
      votes: [],
    });

    response.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

const patchFeedback = async ({ params, body, user }, response, next) => {
  try {
    const { feedbackId } = params;

    const targetFeedback = await Feedback.findOne({
      _id: feedbackId,
      owner: user.id,
    });

    if (targetFeedback) {
      for (let feedback in body) {
        if (feedback && feedback !== "votes") {
          targetFeedback[feedback] = body[feedback];
        }
      }

      await targetFeedback.save();

      return response.status(201).json(targetFeedback);
    }

    response.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async ({ params, user }, response, next) => {
  try {
    const { feedbackId } = params;
    const targetFeedback = await Feedback.findOne({
      _id: feedbackId,
      owner: user.id,
    });

    if (targetFeedback) {
      await Feedback.deleteOne({
        id: feedbackId,
      });
      response.status(204).json({ message: "Feedback deleted successfully" });
    }

    response.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    next(error);
  }
};

export default {
  getFeedbacks,
  postFeedback,
  patchFeedback,
  deleteFeedback,
  getSingleFeedback,
};
