import express from "express";
import devController from "../controllers/devController";

const router = express.Router();

router.get("/", devController.allBooks);

export default router;
