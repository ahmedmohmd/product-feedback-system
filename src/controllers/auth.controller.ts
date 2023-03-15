import { response } from "express";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import config from "../../config/config";
import User from "../models/user.model";
import sendMail from "../services/email.service";
import Consts from "../utils/consts.util";
import passAuth from "../utils/pass-auth";
import generate from "../utils/random-key.util";

const postLogin = async ({ body, session }, res) => {
  try {
    const { email, password } = body;

    const isValidEmail = isEmail(email.trim());

    if (!isValidEmail) {
      return res.status(400).json({ message: "Sorry, email is incorrect" });
    }

    const targetUser = await User.findOne({ email: email });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordsValid = await passAuth.check(
      password,
      targetUser.password
    );

    if (!isPasswordsValid) {
      return res.status(400).json({ message: "Password is not correct!" });
    }

    session.user = {
      id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
    };

    session.isLoggedIn = true;
    await session.save();

    const { name: userName, email: userEmail } = targetUser;

    res.status(200).json({ name: userName, email: userEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const postLogout = async ({ session }, res) => {
  try {
    await session.destroy();
    res.status(200).json({ message: "You have been logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const postReset = async ({ body }, res) => {
  try {
    const { email } = body;

    const isValidEmail = isEmail(email.trim());

    if (!isValidEmail) {
      return res
        .status(400)
        .json({ message: "Sorry, your email is incorrect" });
    }

    const targetUser = await User.findOne({ email: email });
    if (!targetUser) {
      return res.status(404).json({ message: "Sorry, no user Found!" });
    }

    const token = await generate(Consts.RESET_TOKEN_LENGTH);

    targetUser.resetToken = token;
    targetUser.resetTokenExpiration = new Date(
      Date.now() + Consts.MILLISECONDS_IN_HOUR
    );
    await targetUser.save();

    const mailOptions = {
      from: "a7m3d.219@gmail.com",
      to: targetUser.email,
      subject: "Reset Password",
      text: "test email",
      html: `
        <p>
          You can reset your password by clicking the following Link:
          <a href="${config.baseUrl}/reset/${token}">Reset Password</a>
        </p>
      `,
    };

    await sendMail(mailOptions);

    res.status(200).json({ message: "Check you email address!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getNewPassword = async ({ params }, res) => {
  try {
    const { resetToken } = params;
    const targetUser = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "Sorry, User does not exist, Or you entered invalid things.",
      });
    }

    res.status(200).json({ userId: targetUser._id.toString(), resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const postNewPassword = async ({ body }, res) => {
  try {
    const { userId, newPassword, resetToken } = body;

    const isValidPassword = isStrongPassword(newPassword, {
      minLength: Consts.PASSWORD_MIN_LENGTH,
    });

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Sorry,your password is incorrect" });
    }

    const targetUser = await User.findOne({
      _id: userId,
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
    res.status(201).json({ message: "Your Password Update Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error!" });
  }
};

const postRegister = async ({ body }, res) => {
  try {
    const { name, email, password, role } = body;

    // validation
    const isValidEmail = isEmail(email.trim());
    const isValidPassword = isStrongPassword(password, {
      minLength: Consts.PASSWORD_MIN_LENGTH,
    });

    console.log(isValidPassword);

    if (!isValidPassword || !isValidEmail) {
      return res.status(400).json({ message: "Sorry,data is incorrect" });
    }

    const hashedPassword = await passAuth.encrypt(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const { name: userName, email: userEmail } = newUser;

    res.status(201).json({ name: userName, email: userEmail });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
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
