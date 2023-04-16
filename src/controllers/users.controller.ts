import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import isStrongPassword from "validator/lib/isStrongPassword";
import config from "../../config/config";
import User from "../models/user.model";

const getSingleUser = async ({ user }, response, next) => {
  try {
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
    const user = request.user;
    const userImage = request.file;

    console.log(request.body);

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

    if (userImage && userImage !== "undefined") {
      // const isImageDefault = new RegExp("default.png$").test(targetUser.image);

      // if (!isImageDefault && targetUser.image.split("/").at(-1)) {
      //   fs.rmSync(
      //     path.join(
      //       __dirname,
      //       "..",
      //       "images",
      //       targetUser.image.split("/").at(-1) || ""
      //     )
      //   );
      // }

      targetUser.image = `${config.baseUrl}/images/${userImage.originalname}`;
    }

    await targetUser.save();

    const { image, name, email, _id } = targetUser;
    const token = User.generateJWT(targetUser);

    response
      .status(201)
      .json({ updatedImage: image, name, email, id: _id, token: token });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async ({ user }, response, next) => {
  try {
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
