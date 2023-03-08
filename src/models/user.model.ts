import { model, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        return isEmail(value);
      },
      message: "Your Email is not valid!",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  feedbacks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      default: [],
    },
  ],
});

export default model("User", userSchema);
