import User from "../models/user.model";

const postDeleteUser = async ({ params }, res) => {
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

const getUsers = async (_, res) => {
  try {
    const allUsers = await User.find({});

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

export default { postDeleteUser, getUsers };
