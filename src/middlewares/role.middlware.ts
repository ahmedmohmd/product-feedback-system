const authRole = (role: string) => {
  return ({ session }, res, next) => {
    const { user } = session;
    const isAuthenticated = user.role === role;

    if (!isAuthenticated) {
      return res
        .status(403)
        .json({ message: "Sorry, You cannot access to this root!" });
    }

    next();
  };
};

export default authRole;
