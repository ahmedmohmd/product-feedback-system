import Feedback from "../models/feedback.model";

const getFeedbacks = async ({ session }, res) => {
  try {
    const { user } = session;

    await Feedback.find({ owner: user.id })
      .populate("comments")
      .then((feedbacks) => {
        res.status(200).json(feedbacks);
      });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const getSingleFeedback = async ({ params, session }, res) => {
  try {
    const { user } = session;
    const { feedbackId } = params;

    const targetFeedback = await Feedback.findOne({
      _id: feedbackId,
      owner: user.id,
    }).populate("comments");

    if (targetFeedback) {
      return res.status(200).json(targetFeedback);
    }

    res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const postFeedback = async ({ body, session }, res) => {
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

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const patchFeedback = async ({ params, body, session }, res) => {
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

      return res.status(201).json(targetFeedback);
    }

    res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const deleteFeedback = async ({ params, session }, res) => {
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
      return res.status(200).json({ message: "Feedback deleted successfully" });
    }

    res.status(404).json({ message: "Feedback not found!" });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

export default {
  getFeedbacks,
  postFeedback,
  patchFeedback,
  deleteFeedback,
  getSingleFeedback,
};
