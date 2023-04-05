import Feedback from "../models/feedback.model";

const getAllFeedbacks = async ({ query }, response, next) => {
  const { sort = "most-upvotes", tags } = query;

  let sortingLabel = sort === "most-upvotes" ? "votes" : "comments";
  const splittedTags = tags?.split(",");

  try {
    const allFeedbacks = await Feedback.find()
      .sort({ [sortingLabel]: -1 })
      .populate("comments");

    response.json({
      data: allFeedbacks.filter((feedback) => {
        if (splittedTags.length === 1) {
          return true;
        } 
        
        return splittedTags.every((tag) => {
          return feedback.categories.includes(tag);
        });
      }),
    });
  } catch (error) {
    next(error);
  }
};

export default getAllFeedbacks;
