const auth = ({ session }, res, next) => {
  const isAuthenticated = session.isLoggedIn;

  if (!isAuthenticated) {
    return res.status(403).json({ message: "Sorry, you are not logged in!" });
  }

  next();
};

export default auth;
