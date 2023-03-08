import { model, Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 10,
    },
    description: {
      type: String,
      required: true,
      minLength: 15,
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
      type: Number,
      required: true,
      default: 0,
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

export default model("Feedback", feedbackSchema);
