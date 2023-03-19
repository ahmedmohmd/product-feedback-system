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

const getUsers = async ({ query }, response, next) => {
  try {
    const { page = 1 } = query;

    const USERS_PER_PAGE = 10;
    const countUsers = await User.countDocuments();

    const allUsers = await User.find({})
      .skip(USERS_PER_PAGE * (page - 1))
      .limit(USERS_PER_PAGE);

    response.status(200).json({
      data: allUsers,
      next: USERS_PER_PAGE * page < countUsers,
      previous: page > 1,
    });
  } catch (error) {
    next(error);
  }
};

export default { postDeleteUser, getUsers };
