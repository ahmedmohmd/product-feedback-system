import Feedback from "../models/feedback.model";

const getFeedbacks = async ({ session }, response, next) => {
  try {
    const { user } = session;

    await Feedback.find({ owner: user.id })
      .populate("comments")
      .then((feedbacks) => {
        response.status(200).json(feedbacks);
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

    const newFeedback = await Feedback.create({
      title,
      description,
      roadmap,
      votes,
      categories,
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
