import express from "express";
import homeController from "../controllers/home.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/", homeController.getAllFeedbacks);
router.get("/:feedbackId", homeController.getSingleFeedback);
router.get("/:feedbackId/comments", homeController.getComments);
router.post(
  "/:feedbackId",
  authMiddleware.authUser,
  homeController.patchFeedback
);

export default router;
