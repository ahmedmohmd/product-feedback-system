import express from "express";
import feedbacksController from "../controllers/feedbacks.controller";
import auth from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/", auth.authUser, feedbacksController.getFeedbacks);
router.get(
  "/:feedbackId",
  auth.authUser,
  feedbacksController.getSingleFeedback
);
router.post("/", auth.authUser, feedbacksController.postFeedback);
router.patch("/:feedbackId", auth.authUser, feedbacksController.patchFeedback);
router.delete(
  "/:feedbackId",
  auth.authUser,
  feedbacksController.deleteFeedback
);

export default router;
