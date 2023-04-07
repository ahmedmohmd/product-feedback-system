"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controller_1 = __importDefault(require("../controllers/comments.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.get("/feedbacks/:feedbackId/comments", auth_middleware_1.default.authUser, comments_controller_1.default.getComments);
router.get("/feedbacks/:feedbackId/comments/:commentId", auth_middleware_1.default.authUser, comments_controller_1.default.getSingleComment);
router.post("/feedbacks/:feedbackId/comments", auth_middleware_1.default.authUser, comments_controller_1.default.postComment);
router.patch("/feedbacks/:feedbackId/comments/:commentId", auth_middleware_1.default.authUser, comments_controller_1.default.patchComment);
router.delete("/feedbacks/:feedbackId/comments/:commentId", auth_middleware_1.default.authUser, comments_controller_1.default.deleteComment);
exports.default = router;
