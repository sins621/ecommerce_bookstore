import express from "express";
import viewController from "../controllers/viewController.js";
import passport from "passport";
import validator from "../middleware/validator.ts";

const router = express.Router();

router.get("/", viewController.home);
router.get("/test", viewController.test);
router.get("/cart", validator.validateView, viewController.cart);
router.get("/admin", viewController.admin);
router.get("/book/:id", viewController.book);
router.get("/add-book", viewController.addBook);

router.get("/login", viewController.loginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/logout", validator.validateView, viewController.logout);

router.get("/register", viewController.registerForm);
router.post("/register", viewController.register);

export default router;
