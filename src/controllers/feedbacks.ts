const DUMMY_FEEDBACKS = [
  {
    id: "0.32787",
    title: "Add Tags for Solutions",
    description: "Easier to search solutions based on a specific stack",
    roadmap: "planned",
    categories: ["UI", "UX"],
    votes: 10,
  },
];

const getFeedbacks = (_, res) => {
  res.status(200).json(DUMMY_FEEDBACKS);
};

const getSingleFeedback = ({ params }, res) => {
  const { feedbackId } = params;

  const targetFeedback = DUMMY_FEEDBACKS.find((feedback) => {
    return feedback.id === feedbackId;
  });

  if (targetFeedback) {
    return res.status(200).json(targetFeedback);
  }

  res.status(404).json({ message: "Feedback not found!" });
};

const postFeedback = ({ body }, res) => {
  const { title, description, roadmap, votes, categories } = body;

  const newFeedback = {
    id: Math.random().toFixed(5).toString(),
    title,
    description,
    votes,
    categories,
    roadmap,
  };

  DUMMY_FEEDBACKS.push(newFeedback);

  res.status(201).json(DUMMY_FEEDBACKS);
};

const patchFeedback = ({ params, body }, res) => {
  const { feedbackId } = params;

  const targetFeedback = DUMMY_FEEDBACKS.find((feedback) => {
    return feedback.id === feedbackId;
  });

  if (targetFeedback) {
    for (let feedback in body) {
      if (feedback) {
        targetFeedback[feedback] = body[feedback];
      }
    }

    return res.status(201).json(DUMMY_FEEDBACKS);
  }
  res.status(404).json({ message: "Feedback not found!" });
};

const deleteFeedback = ({ params }, res) => {
  const { feedbackId } = params;

  const targetFeedbackIndex = DUMMY_FEEDBACKS.findIndex((feedback) => {
    return feedback.id === feedbackId;
  });

  if (targetFeedbackIndex >= 0) {
    DUMMY_FEEDBACKS.splice(targetFeedbackIndex, 1);
    return res.status(200).json({ message: "Feedback deleted successfully" });
  }

  res.status(404).json({ message: "Feedback not found!" });
};

export default {
  getFeedbacks,
  postFeedback,
  patchFeedback,
  deleteFeedback,
  getSingleFeedback,
};
