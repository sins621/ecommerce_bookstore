import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.allBooks);
router.get("/filter", bookController.fetchBookBy)
router.get("/abstract", bookController.fetchBookAbstract);
router.get("/details", bookController.fetchBookDetails);
router.get("/categories", bookController.fetchCategories);

router.post("/add", bookController.addBook);


export default router;
