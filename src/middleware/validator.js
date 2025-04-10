const validator = {
  validateRoute: async (req, res, next) => {
    if (!req.isAuthenticated())
      return res
        .json({ message: "You must be logged in to view this content" })
        .status(401);

    const user = req.user;
    next(user);
  },

  validateView: async (req, res, next) => {
    if (!req.isAuthenticated()) return res.render("routes/not_auth.ejs");

    const user = req.user;
    next(user);
  },
};

export default validator;
