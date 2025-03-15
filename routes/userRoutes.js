import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router()

router.get("/:id", userController.fetchUserById)
router.get("/cart/:id", userController.fetchCartItems)

export default router;
