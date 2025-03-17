import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/user/:id", userController.fetchUserById);
router.get("/cart", userController.fetchCartItems);

router.post("/cart/add-book", userController.addBooktoCart);

export default router;
