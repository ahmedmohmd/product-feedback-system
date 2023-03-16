import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import User from "../models/user.model";
import Consts from "../utils/consts.util";
import passAuth from "../utils/pass-auth";

const getSingleUser = async ({ params }, response, next) => {
  try {
    const { userId } = params;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return response.status(404).json({ message: "User not found!" });
    }

    response.status(200).json(targetUser);
  } catch (error) {
    next(error);
  }
};

const patchUser = async ({ body, params }, response, next) => {
  try {
    const { userId } = params;
    const { email, password } = body;

    // validation
    const isValidEmail = isEmail(email.trim());
    const isValidPassword = isStrongPassword(password, {
      minLength: Consts.PASSWORD_MIN_LENGTH,
    });

    if (!isValidPassword || !isValidEmail) {
      return response.status(400).json({ message: "Sorry,data is incorrect" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return response.status(404).json({ message: "Sorry, User not found!" });
    }

    for (let field in body) {
      if (field === "password" || field === "email") {
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
    response.status(201).json({ name: userName, email: userEmail });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async ({ params }, response, next) => {
  try {
    const { userId } = params;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return response.status(404).json({ message: "User not found!" });
    }

    User.deleteOne({
      id: userId,
    });

    response.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getSingleUser,
  patchUser,
  deleteUser,
};
