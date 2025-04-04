import express from "express";

const validator = {
  validateRoute: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.isAuthenticated())
      return res
        .json({ message: "You must be logged in to view this content" })
        .status(401);

    const user: Express.User = req.user;
    next(user);
  },

  validateView: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.isAuthenticated()) return res.render("routes/not_auth.ejs");

    const user: Express.User = req.user;
    next(user);
  },
};

export default validator;
