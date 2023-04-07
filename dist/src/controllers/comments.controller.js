"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_model_1 = __importDefault(require("../models/comment.model"));
const feedback_model_1 = __importDefault(require("../models/feedback.model"));
const getComments = ({ params, session }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId } = params;
        const { user } = session;
        const comments = yield comment_model_1.default.find({
            feedback: feedbackId,
            author: user.id,
        }).populate("author", "name");
        response.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }
});
const getSingleComment = ({ params, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId, commentId } = params;
        const targetComment = yield comment_model_1.default.findOne({
            _id: commentId,
            feedback: feedbackId,
            author: user.id,
        });
        if (!targetComment) {
            return response
                .status(404)
                .json({ message: "Comment not found!" })
                .populate("owner");
        }
        response.status(200).json(targetComment);
    }
    catch (error) {
        next(error);
    }
});
const postComment = ({ body, params, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = body;
        const { feedbackId } = params;
        const newComment = yield comment_model_1.default.create({
            content,
            feedback: feedbackId,
            author: user.id,
        });
        yield feedback_model_1.default.findByIdAndUpdate(feedbackId, { $push: { comments: newComment._id } }, { new: true });
        response.status(201).json(newComment);
    }
    catch (error) {
        next(error);
    }
});
const patchComment = ({ body, params, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId, commentId } = params;
        const targetComment = yield comment_model_1.default.findOne({
            _id: commentId,
            feedback: feedbackId,
            author: user.id,
        });
        if (!targetComment) {
            return response.status(404).json({ message: "Comment not found!" });
        }
        for (let field in body) {
            if (field) {
                targetComment[field] = body[field];
            }
        }
        yield targetComment.save();
        response.status(201).json(targetComment);
    }
    catch (error) {
        next(error);
    }
});
const deleteComment = ({ params, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId, commentId } = params;
        const targetComment = yield comment_model_1.default.findOne({
            _id: commentId,
            feedback: feedbackId,
            author: user.id,
        });
        if (!targetComment) {
            return response.status(404).json({ message: "Comment not found!" });
        }
        yield comment_model_1.default.deleteOne({
            _id: commentId,
            feedback: feedbackId,
        });
        response.status(204).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getComments,
    getSingleComment,
    postComment,
    patchComment,
    deleteComment,
};
