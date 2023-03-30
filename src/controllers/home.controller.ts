import Feedback from "../models/feedback.model";

const getAllFeedbacks = async (request, response, next) => {
  try {
    const allFeedbacks = await Feedback.find({}).populate("comments");

    response.json({ data: allFeedbacks });
  } catch (error) {
    next(error);
  }
};

export default getAllFeedbacks;
