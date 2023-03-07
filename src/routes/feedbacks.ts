import express from "express";
import feedbacksController from "../controllers/feedbacks";
const router = express.Router();

router.get("/", feedbacksController.getFeedbacks);
router.get("/:feedbackId", feedbacksController.getSingleFeedback);
router.post("/", feedbacksController.postFeedback);
router.patch("/:feedbackId", feedbacksController.patchFeedback);
router.delete("/:feedbackId", feedbacksController.deleteFeedback);

export default router;
