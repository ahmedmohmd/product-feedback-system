const authUser = ({ session }, res, next) => {
  const isAuthenticated = session.isLoggedIn;

  if (!isAuthenticated) {
    return res.status(403).json({ message: "Sorry, you are not logged in!" });
  }

  next();
};

const authAdmin = ({ session }, res, next) => {
  const user = session.uer;
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
