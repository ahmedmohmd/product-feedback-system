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
const feedback_model_1 = __importDefault(require("../models/feedback.model"));
const getFeedbacks = ({ user, query }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1 } = query;
        const ITEMS_PER_PAGE = 10;
        const countFeedbacks = yield feedback_model_1.default.countDocuments({ owner: user.id });
        yield feedback_model_1.default.find({ owner: user.id })
            .skip(ITEMS_PER_PAGE * (page - 1))
            .limit(ITEMS_PER_PAGE)
            .populate("comments")
            .then((feedbacks) => {
            response.status(200).json({
                data: feedbacks,
                next: page * ITEMS_PER_PAGE < countFeedbacks,
                previous: page > 1,
            });
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleFeedback = ({ params, session }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = session;
        const { feedbackId } = params;
        const targetFeedback = yield feedback_model_1.default.findOne({
            _id: feedbackId,
            owner: user.id,
        }).populate("comments");
        if (targetFeedback) {
            return response.status(200).json(targetFeedback);
        }
        response.status(404).json({ message: "Feedback not found!" });
    }
    catch (error) {
        next(error);
    }
});
const postFeedback = ({ body, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, roadmap, votes, categories } = body;
        const newTags = categories;
        newTags.push("All");
        const newFeedback = yield feedback_model_1.default.create({
            title,
            description,
            roadmap,
            votes,
            categories: newTags,
            owner: user.id,
        });
        response.status(201).json(newFeedback);
    }
    catch (error) {
        next(error);
    }
});
const patchFeedback = ({ params, body, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId } = params;
        const targetFeedback = yield feedback_model_1.default.findOne({
            _id: feedbackId,
            owner: user.id,
        });
        if (targetFeedback) {
            for (let feedback in body) {
                if (feedback) {
                    targetFeedback[feedback] = body[feedback];
                }
            }
            yield targetFeedback.save();
            return response.status(201).json(targetFeedback);
        }
        response.status(404).json({ message: "Feedback not found!" });
    }
    catch (error) {
        next(error);
    }
});
const deleteFeedback = ({ params, user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId } = params;
        const targetFeedback = yield feedback_model_1.default.findOne({
            _id: feedbackId,
            owner: user.id,
        });
        if (targetFeedback) {
            yield feedback_model_1.default.deleteOne({
                id: feedbackId,
            });
            response.status(204).json({ message: "Feedback deleted successfully" });
        }
        response.status(404).json({ message: "Feedback not found!" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getFeedbacks,
    postFeedback,
    patchFeedback,
    deleteFeedback,
    getSingleFeedback,
};
