import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import User from "../models/user.model";
import sendMail from "../services/email.service";
import Consts from "../utils/consts.util";
import passAuth from "../utils/pass-auth";
import generate from "../utils/random-key.util";

const postLogin = async (request, response, next) => {
  try {
    const { body } = request;
    const { email, password } = body;

    // validation
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const targetUser = await User.findOne({ email: email });

    if (!targetUser) {
      return response.status(404).json({ message: "User not found!" });
    }

    const isPasswordsValid = await passAuth.check(
      password,
      targetUser.password
    );

    if (!isPasswordsValid) {
      return response.status(400).json({ message: "Password is not correct!" });
    }

    const token = User.generateJWT(targetUser);

    response.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const postLogout = async (request, response, next) => {
  try {
    response.status(200).json({ message: "You have been logged out" });
  } catch (error) {
    next(error);
  }
};

const postReset = async (request, response, next) => {
  try {
    const { email } = request.body;

    // validation
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const targetUser = await User.findOne({ email: email });

    if (!targetUser) {
      return response.status(404).json({ message: "Sorry, no user Found!" });
    }

    const token = await generate(Consts.RESET_TOKEN_LENGTH);

    targetUser.resetToken = token;
    targetUser.resetTokenExpiration = new Date(
      Date.now() + Consts.MILLISECONDS_IN_HOUR
    );
    await targetUser.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: targetUser.email,
      subject: "Reset Password",
      text: "Reset Password",
      html: `
        <div style="font-family: sans-serif; font-size: 18px; border-radius: 15px;">
          <p>Hi <b>${
            targetUser.name
          }</b> 🙂, You can reset Your Email from Link Down Below.</p> 
          <a href="${"http://localhost:5173"}/new-password/${token}" style="background: #a855f7; padding: 10px; text-decoration: none; color: white;">Reset Password</a>
        </div>
      `,
    };

    await sendMail(mailOptions);

    response.status(200).json({ message: "Check you email address!" });
  } catch (error) {
    next(error);
  }
};

const getNewPassword = async ({ params }, response, next) => {
  try {
    const { resetToken } = params;
    const targetUser = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });

    if (!targetUser) {
      return response.status(404).json({
        message: "Sorry, User does not exist, Or you entered invalid things.",
      });
    }

    response
      .status(200)
      .json({ userId: targetUser._id.toString(), resetToken });
  } catch (error) {
    next(error);
  }
};

const postNewPassword = async (request, response, next) => {
  try {
    const { newPassword, resetToken } = request.body;

    // validation
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const targetUser = await User.findOne({
      // _id: userId,
      resetToken: resetToken,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });

    if (!targetUser) {
      return response.status(404).json({ message: "User does not exist!" });
    }

    targetUser.password = newPassword;
    targetUser.resetToken = undefined;
    targetUser.resetTokenExpiration = undefined;

    await targetUser.save();
    response.status(201).json({ message: "Your Password Update Successfully" });
  } catch (error) {
    next(error);
  }
};

const postRegister = async (request, response, next) => {
  try {
    const { body, file } = request;
    const { name, email, password, role } = body;
    const userImage = file;

    // validation
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      image: userImage
        ? `${config.baseUrl}/images/${userImage?.originalname}`
        : `${config.baseUrl}/images/default.png`,
    });

    const { name: userName, email: userEmail, image: usrImage } = newUser;

    response
      .status(201)
      .json({ name: userName, email: userEmail, image: usrImage });
  } catch (error) {
    next(error);
  }
};

export default {
  postLogin,
  postLogout,
  postReset,
  postNewPassword,
  getNewPassword,
  postRegister,
};
