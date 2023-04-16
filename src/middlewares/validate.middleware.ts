import { body } from "express-validator";
import User from "../models/user.model";

enum ErrorMessages {
  USER_EXISTS = "Sorry, this email already exists!",
  INVALID_PASSWORD = "Sorry, your password is incorrect. Please try again",
  INVALID_EMAIL = "Sorry, your email address is invalid or already exists!",
}

const validateEmail = (custom: boolean = false) => {
  if (!custom) {
    return body("email")
      .trim()
      .isEmail()
      .withMessage(ErrorMessages.INVALID_EMAIL);
  }

  return body("email")
    .trim()
    .isEmail()
    .custom(async (value) => {
      const targetUser = await User.findOne({
        email: value,
      });

      if (targetUser) {
        return Promise.reject("Sorry, this email already exists!");
      }
    })
    .withMessage(ErrorMessages.INVALID_EMAIL);
};

const validatePassword = (passwordFieldName: string = "password") => {
  return body(passwordFieldName)
    .isLength({
      max: 15,
      min: 8,
    })
    .withMessage(ErrorMessages.INVALID_PASSWORD);
};

export default {
  validateEmail,
  validatePassword,
};
