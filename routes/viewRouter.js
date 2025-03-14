import express from "express";
import viewController from "../controllers/viewController.js";
import passport from "passport";


const router = express.Router();

router.get("/", viewController.home);
router.get("/book/:id", viewController.book);
router.get("/login", viewController.loginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/logout", viewController.logout);

router.get("/register", viewController.registerForm);
router.post("/register", viewController.register);

export default router;
