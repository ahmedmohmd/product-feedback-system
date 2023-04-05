import Feedback from "../models/feedback.model";

const getFeedbacks = async ({ session, query }, response, next) => {
  try {
    const { user } = session;
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

const getSingleFeedback = async ({ params, session }, response, next) => {
  try {
    const { user } = session;
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

const postFeedback = async ({ body, session }, response, next) => {
  try {
    const { title, description, roadmap, votes, categories } = body;
    const newTags = categories;
    newTags.push("All");

    const newFeedback = await Feedback.create({
      title,
      description,
      roadmap,
      votes,
      categories: newTags,
      owner: session.user.id,
    });

    response.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

const patchFeedback = async ({ params, body, session }, response, next) => {
  try {
    const { user } = session;
    const { feedbackId } = params;

    const targetFeedback = await Feedback.findOne({
      _id: feedbackId,
      owner: user.id,
    });

    if (targetFeedback) {
      for (let feedback in body) {
        if (feedback) {
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

const deleteFeedback = async ({ params, session }, response, next) => {
  const { user } = session;

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
