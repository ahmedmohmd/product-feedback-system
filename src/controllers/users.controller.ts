import bcrypt from "bcrypt";
import User from "../models/user.model";
import passAuth from "../utils/pass-auth";

const getUsers = async (_, res) => {
  try {
    const allUsers = await User.find({});

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("An error occurred!", error);
    res.status(500).json({ message: "An Internal Server Error Occurred" });
  }
};

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

const postUser = async ({ body }, res) => {
  try {
    const { name, email, password, role } = body;
    const hashedPassword = await passAuth.encrypt(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
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
  getUsers,
  getSingleUser,
  postUser,
  patchUser,
  deleteUser,
};
