import { model, Schema } from "mongoose";
import Comment from "./comment.model";

const feedbackSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    roadmap: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
      default: ["All"],
    },
    votes: {
      type: [String],
      required: true,
      default: [],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.pre("deleteMany", async function (next) {
  const feedback = this.getQuery();

  try {
    await Comment.deleteMany({
      feedback: feedback._id,
    });

    return next();
  } catch (error: any) {
    next(error);
  }
});

export default model("Feedback", feedbackSchema);
