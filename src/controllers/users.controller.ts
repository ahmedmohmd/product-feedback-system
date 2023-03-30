import { validationResult } from "express-validator";
import fs from "fs";
import isStrongPassword from "validator/lib/isStrongPassword";
import User from "../models/user.model";

const getSingleUser = async ({ session }, response, next) => {
  try {
    const { user } = session;
    const targetUser = await User.findById(user.id);

    if (!targetUser) {
      return response.status(404).json({ message: "User not found!" });
    }

    response.status(200).json(targetUser);
  } catch (error) {
    next(error);
  }
};

const patchUser = async (request, response, next) => {
  try {
    const { user } = request.session;
    const userImage = request.file;

    // validation
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const targetUser = await User.findById(user.id);
    if (!targetUser) {
      return response.status(404).json({ message: "Sorry, User not found!" });
    }

    for (let field in request.body) {
      if (field === "email") {
        continue;
      }

      if (request.body[field]) {
        targetUser[field] = request.body[field];
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

const deleteUser = async ({ session }, response, next) => {
  try {
    const { user } = session;
    const targetUser = await User.findById(user.id);

    if (!targetUser) {
      return response.status(404).json({ message: "User not found!" });
    }

    await User.deleteOne({
      _id: user.id,
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
