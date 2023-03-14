import express from "express";
import commentsController from "../controllers/comments.controller";
import auth from "../middlewares/auth.middleware";
const router = express.Router();

router.get(
  "/feedbacks/:feedbackId/comments",
  auth.authUser,
  commentsController.getComments
);

router.get(
  "/feedbacks/:feedbackId/comments/:commentId",
  auth.authUser,
  commentsController.getSingleComment
);

router.post(
  "/feedbacks/:feedbackId/comments",
  auth.authUser,
  commentsController.postComment
);

router.patch(
  "/feedbacks/:feedbackId/comments/:commentId",
  auth.authUser,
  commentsController.patchComment
);

router.delete(
  "/feedbacks/:feedbackId/comments/:commentId",
  auth.authUser,
  commentsController.deleteComment
);
export default router;
