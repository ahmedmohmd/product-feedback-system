import express from "express";
import commentsController from "../controllers/comments.controller";
import auth from "../middlewares/auth.middware";
const router = express.Router();

router.get(
  "/feedbacks/:feedbackId/comments",
  auth,
  commentsController.getComments
);

router.get(
  "/feedbacks/:feedbackId/comments/:commentId",
  auth,
  commentsController.getSingleComment
);

router.post(
  "/feedbacks/:feedbackId/comments",
  auth,
  commentsController.postComment
);

router.patch(
  "/feedbacks/:feedbackId/comments/:commentId",
  auth,
  commentsController.patchComment
);

router.delete(
  "/feedbacks/:feedbackId/comments/:commentId",
  auth,
  commentsController.deleteComment
);
export default router;
