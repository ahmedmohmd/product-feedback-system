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
const mongoose_1 = require("mongoose");
const comment_model_1 = __importDefault(require("./comment.model"));
const feedbackSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        minLength: 10,
    },
    description: {
        type: String,
        required: true,
        minLength: 15,
    },
    roadmap: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        required: true,
        default: ["All"],
    },
    votes: {
        type: Number,
        required: true,
        default: 0,
    },
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
feedbackSchema.pre("deleteMany", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const feedback = this.getQuery();
        try {
            yield comment_model_1.default.deleteMany({
                feedback: feedback._id,
            });
            return next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.default = (0, mongoose_1.model)("Feedback", feedbackSchema);
