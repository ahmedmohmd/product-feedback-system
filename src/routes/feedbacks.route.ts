import express from "express";
import feedbacksController from "../controllers/feedbacks.controller";
import auth from "../middlewares/auth.middware";
const router = express.Router();

router.get("/", auth, feedbacksController.getFeedbacks);
router.get("/:feedbackId", auth, feedbacksController.getSingleFeedback);
router.post("/", auth, feedbacksController.postFeedback);
router.patch("/:feedbackId", auth, feedbacksController.patchFeedback);
router.delete("/:feedbackId", auth, feedbacksController.deleteFeedback);

export default router;
