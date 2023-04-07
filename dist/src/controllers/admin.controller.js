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
const fs_1 = __importDefault(require("fs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const postDeleteUser = ({ params }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = params;
        const targetUser = yield user_model_1.default.findById(userId);
        if (!targetUser) {
            return response.status(404).json({ message: "User not found!" });
        }
        user_model_1.default.deleteOne({
            id: userId,
        });
        const isImageDefault = new RegExp("default.png$").test(targetUser.image);
        if (!isImageDefault) {
            fs_1.default.rmSync(targetUser.image);
        }
        response.status(204).json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
const getUsers = ({ query }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1 } = query;
        const USERS_PER_PAGE = 10;
        const countUsers = yield user_model_1.default.countDocuments();
        const allUsers = yield user_model_1.default.find({})
            .skip(USERS_PER_PAGE * (page - 1))
            .limit(USERS_PER_PAGE);
        response.status(200).json({
            data: allUsers,
            next: USERS_PER_PAGE * page < countUsers,
            previous: page > 1,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = { postDeleteUser, getUsers };
