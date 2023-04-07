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
const getAllFeedbacks = ({ query }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort = "most-upvotes", tags } = query;
    let sortingLabel = sort === "most-upvotes" ? "votes" : "comments";
    const splittedTags = tags === null || tags === void 0 ? void 0 : tags.split(",");
    try {
        const allFeedbacks = yield feedback_model_1.default.find()
            .sort({ [sortingLabel]: -1 })
            .populate("comments");
        response.json({
            data: allFeedbacks.filter((feedback) => {
                if (splittedTags.length === 1) {
                    return true;
                }
                return splittedTags.every((tag) => {
                    return feedback.categories.includes(tag);
                });
            }),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = getAllFeedbacks;
