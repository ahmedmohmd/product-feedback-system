import bcrypt from "bcrypt";
import User from "../models/user.model";

const login = async ({ body, session }, res) => {
  try {
    const { email, password } = body;
    const targetUser = await User.findOne({ email: email });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordsValid = await bcrypt.compare(
      password,
      targetUser.password
    );

    if (!isPasswordsValid) {
      return res.status(400).json({ message: "Password is not correct!" });
    }

    session.user = {
      id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
    };

    session.isLoggedIn = true;
    await session.save();

    res.status(200).json(targetUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const logout = async ({ session }, res) => {
  try {
    await session.destroy();
    res.status(200).json({ message: "You have been logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export default {
  login,
  logout,
};
