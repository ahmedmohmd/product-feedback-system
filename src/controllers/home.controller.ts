import Feedback from "../models/feedback.model";

const getAllFeedbacks = async ({ query }, response, next) => {
  const { sort = "most-upvotes", tags } = query;

  let sortingLabel = sort === "most-upvotes" ? "votes" : "comments";
  const splittedTags = tags?.split(",");

  try {
    const allFeedbacks = await Feedback.find().populate("comments");
    allFeedbacks.sort((a, b) => {
      return a[sortingLabel].length - b[sortingLabel].length;
    });

    response.json({
      data: allFeedbacks
        .filter((feedback) => {
          if (splittedTags?.length === 1) {
            return true;
          }

          return splittedTags.every((tag) => {
            return feedback.categories.includes(tag);
          });
        })
        .reverse(),
    });
  } catch (error) {
    next(error);
  }
};

const patchFeedback = async ({ params, user }, response, next) => {
  try {
    const { feedbackId } = params;

    const targetFeedback = await Feedback.findById(feedbackId);

    if (!targetFeedback) {
      return response.status(404).json({ message: "Feedback not found!" });
    }

    const isDuplcatesVotes = targetFeedback.votes.includes(user.email);

    if (isDuplcatesVotes) {
      targetFeedback.votes = targetFeedback.votes.filter(
        (email) => email !== user.email
      );
    } else {
      targetFeedback.votes.push(user.email);
    }

    await targetFeedback.save();

    response.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

export default { getAllFeedbacks, patchFeedback };
