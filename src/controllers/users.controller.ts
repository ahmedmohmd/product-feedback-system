import User from "../models/user.model";

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

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    for (let field in body) {
      if (body[field]) {
        targetUser[field] = body[field];
      }
    }

    await targetUser.save();
    res.status(201).json(targetUser);
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
