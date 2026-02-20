import {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createReview, deleteReview } from "../controllers/review.controller.js";

const router = Router();

router.post("/", protectRoute, createReview);

//did not implement this function in the frontend 
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;