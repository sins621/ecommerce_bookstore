import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.allBooks);
router.get("/abstract", bookController.fetchBookAbstract);
router.get("/details", bookController.fetchBookDetails);

export default router;
