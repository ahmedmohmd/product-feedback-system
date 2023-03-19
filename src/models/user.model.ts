import { model, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import passAuth from "../utils/pass-auth";

const userSchema = new Schema(
  {
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
      },
    ],
    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
    image: {
      type: String,
      default: "./src/images/default.png",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const newPassword = await passAuth.encrypt(user.password);
    user.password = newPassword;
  }

  next();
});

export default model("User", userSchema);
