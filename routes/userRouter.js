import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/user/:id", userController.fetchUserById);
router.post("/add-review", userController.addBookReview)
router.get("/reviews/:id", userController.fetchReviews);
router.get("/cart", userController.fetchCartItems);

router.post("/cart/add-book", userController.addBooktoCart);

export default router;
