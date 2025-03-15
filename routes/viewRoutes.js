import express from "express";
import viewController from "../controllers/viewController.js"

const router = express.Router()

router.get('/', viewController.home)

export default router;