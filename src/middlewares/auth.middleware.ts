import jwt from "jsonwebtoken";

const authUser = async (request, res, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Sorry, you are not logged in!" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_SECRET || "pYtHoNisTa"
    );

    request.user = decodedToken;

    next();
  } catch (error) {
    next(error);
  }
};

const authAdmin = (request, res, next) => {
  const user = request.user;
  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Sorry, you are not allowed to access this page." });
  }

  next();
};

export default {
  authUser,
  authAdmin,
};
