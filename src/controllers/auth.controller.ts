import config from "../../config/config";
import User from "../models/user.model";
import sendMail from "../services/email.service";
import passAuth from "../utils/pass-auth";
import generate from "../utils/random-key.util";

const postLogin = async ({ body, session }, res) => {
  try {
    const { email, password } = body;
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

    res.status(200).json(targetUser);
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
    const targetUser = await User.findOne({ email: email });

    if (!targetUser) {
      return res.status(404).json({ message: "Sorry, no user Found!" });
    }

    const token = await generate(32);

    const MILLISECONDS_IN_HOUR = 60 * 60 * 60;

    targetUser.resetToken = token;
    targetUser.resetTokenExpiration = new Date(
      Date.now() + MILLISECONDS_IN_HOUR
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

export default {
  postLogin,
  postLogout,
  postReset,
};
