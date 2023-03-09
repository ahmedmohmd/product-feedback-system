import bcrypt from "bcrypt";
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
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

// userSchema.pre("save", async function (next) {
//   const newPassword = await bcrypt.hash(this.password, 10);

//   this.password = newPassword;
//   next();
// });

export default model("User", userSchema);
