import express from "express";
import devController from "../controllers/devController.js";

const router = express.Router();

router.get("/add", devController.addBook);

export default router;
