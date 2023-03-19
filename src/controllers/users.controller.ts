import fs from "fs";
import isStrongPassword from "validator/lib/isStrongPassword";
import User from "../models/user.model";
import Consts from "../utils/consts.util";

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

const patchUser = async ({ body, params, file }, response, next) => {
  try {
    const { userId } = params;
    const { password } = body;
    const userImage = file;

    // validation
    if (password) {
      const isValidPassword = isStrongPassword(password, {
        minLength: Consts.PASSWORD_MIN_LENGTH,
      });

      if (!isValidPassword) {
        return response
          .status(400)
          .json({ message: "Sorry,data is incorrect" });
      }
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return response.status(404).json({ message: "Sorry, User not found!" });
    }

    for (let field in body) {
      if (field === "email") {
        continue;
      }

      if (body[field]) {
        targetUser[field] = body[field];
      }
    }

    if (userImage) {
      const isImageDefault = new RegExp("default.png$").test(targetUser.image);

      if (!isImageDefault) {
        fs.rmSync(targetUser.image);
      }

      targetUser.image = userImage.path;
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

    const isImageDefault = new RegExp("default.png$").test(targetUser.image);

    if (!isImageDefault) {
      fs.rmSync(targetUser.image);
    }

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
