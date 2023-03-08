import express from "express";
import commentsController from "../controllers/comments.controller";
const router = express.Router();

router.get("/feedbacks/:feedbackId/comments", commentsController.getComments);

router.get(
  "/feedbacks/:feedbackId/comments/:commentId",
  commentsController.getSingleComment
);

router.post("/feedbacks/:feedbackId/comments", commentsController.postComment);

router.patch(
  "/feedbacks/:feedbackId/comments/:commentId",
  commentsController.patchComment
);

router.delete(
  "/feedbacks/:feedbackId/comments/:commentId",
  commentsController.deleteComment
);
export default router;
