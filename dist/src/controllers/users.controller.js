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
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getSingleUser = ({ user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUser = yield user_model_1.default.findById(user.id);
        if (!targetUser) {
            return response.status(404).json({ message: "User not found!" });
        }
        response.status(200).json(targetUser);
    }
    catch (error) {
        next(error);
    }
});
const patchUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        const userImage = request.file;
        // validation
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const targetUser = yield user_model_1.default.findById(user.id);
        if (!targetUser) {
            return response.status(404).json({ message: "Sorry, User not found!" });
        }
        for (let field in request.body) {
            if (field === "email") {
                continue;
            }
            if (request.body[field]) {
                targetUser[field] = request.body[field];
            }
        }
        if (userImage) {
            const isImageDefault = new RegExp("default.png$").test(targetUser.image);
            if (!isImageDefault) {
                fs_1.default.rmSync(targetUser.image);
            }
            targetUser.image = userImage.path;
        }
        const { name: userName, email: userEmail } = targetUser;
        yield targetUser.save();
        response.status(201).json({ name: userName, email: userEmail });
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = ({ user }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUser = yield user_model_1.default.findById(user.id);
        if (!targetUser) {
            return response.status(404).json({ message: "User not found!" });
        }
        yield user_model_1.default.deleteOne({
            _id: user.id,
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
exports.default = {
    getSingleUser,
    patchUser,
    deleteUser,
};
