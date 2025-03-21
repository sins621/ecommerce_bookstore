import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/user/:id", userController.fetchUserById);
router.get("/user-roles", userController.fetchUserRoles);
router.get("/reviews/:id", userController.fetchReviews);
router.get("/cart", userController.fetchCartItems);

router.post("/add-review", userController.addBookReview)
router.post("/add-subscriber", userController.addSubscriber);
router.post("/cart/add-book", userController.addBooktoCart);

router.delete("/remove-book", userController.deleteBookFromCart);
export default router;
