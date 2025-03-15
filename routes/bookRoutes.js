import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router()

router.get('/', bookController.allBooks)

export default router;
