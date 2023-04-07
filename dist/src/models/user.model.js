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
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const pass_auth_1 = __importDefault(require("../utils/pass-auth"));
const comment_model_1 = __importDefault(require("./comment.model"));
const feedback_model_1 = __importDefault(require("./feedback.model"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                return (0, isEmail_1.default)(value);
            },
            message: "Your Email is not valid!",
        },
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    feedbacks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Feedback",
        },
    ],
    image: {
        type: String,
        default: "./src/images/default.png",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            const newPassword = yield pass_auth_1.default.encrypt(user.password);
            user.password = newPassword;
        }
        next();
    });
});
userSchema.pre("deleteOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this.getQuery();
        try {
            yield feedback_model_1.default.deleteMany({
                owner: user._id,
            });
            yield comment_model_1.default.deleteMany({
                author: user._id,
            });
            return next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.default = (0, mongoose_1.model)("User", userSchema);
