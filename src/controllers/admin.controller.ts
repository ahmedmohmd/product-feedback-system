import fs from "fs";
import User from "../models/user.model";

const postDeleteUser = async ({ params }, response, next) => {
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

const getUsers = async (_, response, next) => {
  try {
    const allUsers = await User.find({});

    response.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

export default { postDeleteUser, getUsers };
