import Feedback from "../models/feedback.model";

const getFeedbacks = async (_, res) => {
  try {
    await Feedback.find({})
      .populate("comments")
      .then((feedbacks) => {
        res.status(200).json(feedbacks);
      });
  } catch (error) {
    console.error("There are an Error!");
  }
};

const getSingleFeedback = async ({ params }, res) => {
  try {
    const { feedbackId } = params;
    const targetFeedback = await Feedback.findById(feedbackId).populate(
      "comments"
    );

    if (targetFeedback) {
      return res.status(200).json(targetFeedback);
    }

    res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    console.error("There are an Error!");
  }
};

const postFeedback = async ({ body }, res) => {
  try {
    const { title, description, roadmap, votes, categories } = body;
    const newFeedback = await Feedback.create({
      title,
      description,
      roadmap,
      votes,
      categories,
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("There are an Error!");
  }
};

const patchFeedback = async ({ params, body }, res) => {
  try {
    const { feedbackId } = params;

    const targetFeedback = await Feedback.findById(feedbackId);

    if (targetFeedback) {
      for (let feedback in body) {
        if (feedback) {
          targetFeedback[feedback] = body[feedback];
        }
      }

      await targetFeedback.save();

      return res.status(201).json(targetFeedback);
    }

    res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    console.error("There are an Error!");
  }
};

const deleteFeedback = async ({ params }, res) => {
  try {
    const { feedbackId } = params;
    const targetFeedback = await Feedback.findById(feedbackId);

    if (targetFeedback) {
      await Feedback.deleteOne({
        id: feedbackId,
      });
      return res.status(200).json({ message: "Feedback deleted successfully" });
    }

    res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    console.error("There are an Error!");
  }
};

export default {
  getFeedbacks,
  postFeedback,
  patchFeedback,
  deleteFeedback,
  getSingleFeedback,
};
