import { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    feedback: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);
