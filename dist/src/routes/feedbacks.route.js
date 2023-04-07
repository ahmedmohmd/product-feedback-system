"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbacks_controller_1 = __importDefault(require("../controllers/feedbacks.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default.authUser, feedbacks_controller_1.default.getFeedbacks);
router.get("/:feedbackId", auth_middleware_1.default.authUser, feedbacks_controller_1.default.getSingleFeedback);
router.post("/", auth_middleware_1.default.authUser, feedbacks_controller_1.default.postFeedback);
router.patch("/:feedbackId", auth_middleware_1.default.authUser, feedbacks_controller_1.default.patchFeedback);
router.delete("/:feedbackId", auth_middleware_1.default.authUser, feedbacks_controller_1.default.deleteFeedback);
exports.default = router;
