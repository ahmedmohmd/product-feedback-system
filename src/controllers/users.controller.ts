import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import User from "../models/user.model";
import Consts from "../utils/consts.util";
import passAuth from "../utils/pass-auth";

const getSingleUser = async ({ params }, res) => {
  try {
    const { userId } = params;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(targetUser);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const patchUser = async ({ body, params }, res) => {
  try {
    const { userId } = params;
    const { email, password } = body;

    // validation
    const isValidEmail = isEmail(email.trim());
    const isValidPassword = isStrongPassword(password, {
      minLength: Consts.PASSWORD_MIN_LENGTH,
    });

    if (!isValidPassword || !isValidEmail) {
      return res.status(400).json({ message: "Sorry,data is incorrect" });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    for (let field in body) {
      if (field === "password") {
        continue;
      }

      if (body[field]) {
        targetUser[field] = body[field];
      }
    }

    if (password) {
      const newHashedPassword = await passAuth.encrypt(password);
      targetUser.password = newHashedPassword;
    }

    const { name: userName, email: userEmail } = targetUser;
    await targetUser.save();
    res.status(201).json({ name: userName, email: userEmail });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

const deleteUser = async ({ params }, res) => {
  try {
    const { userId } = params;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    User.deleteOne({
      id: userId,
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

export default {
  getSingleUser,
  patchUser,
  deleteUser,
};
