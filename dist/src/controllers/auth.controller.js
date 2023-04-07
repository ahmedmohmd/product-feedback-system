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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const user_model_1 = __importDefault(require("../models/user.model"));
const email_service_1 = __importDefault(require("../services/email.service"));
const consts_util_1 = __importDefault(require("../utils/consts.util"));
const pass_auth_1 = __importDefault(require("../utils/pass-auth"));
const random_key_util_1 = __importDefault(require("../utils/random-key.util"));
const postLogin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = request;
        const { email, password } = body;
        // validation
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const targetUser = yield user_model_1.default.findOne({ email: email });
        if (!targetUser) {
            return response.status(404).json({ message: "User not found!" });
        }
        const isPasswordsValid = yield pass_auth_1.default.check(password, targetUser.password);
        if (!isPasswordsValid) {
            return response.status(400).json({ message: "Password is not correct!" });
        }
        const token = yield jsonwebtoken_1.default.sign({
            id: targetUser._id,
            name: targetUser.name,
            email: targetUser.email,
            image: targetUser.image,
            role: targetUser.role,
        }, "pythonista", {
            expiresIn: "1h",
        });
        response.status(200).json({ token });
    }
    catch (error) {
        next(error);
    }
});
const postLogout = ({ session }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield session.destroy();
        response.status(200).json({ message: "You have been logged out" });
    }
    catch (error) {
        next(error);
    }
});
const postReset = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = request.body;
        // validation
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const targetUser = yield user_model_1.default.findOne({ email: email });
        if (!targetUser) {
            return response.status(404).json({ message: "Sorry, no user Found!" });
        }
        const token = yield (0, random_key_util_1.default)(consts_util_1.default.RESET_TOKEN_LENGTH);
        targetUser.resetToken = token;
        targetUser.resetTokenExpiration = new Date(Date.now() + consts_util_1.default.MILLISECONDS_IN_HOUR);
        yield targetUser.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: targetUser.email,
            subject: "Reset Password",
            text: "Reset Password",
            html: `
        <div style="font-family: sans-serif; font-size: 18px; border-radius: 15px;">
          <p>Hi <b>${targetUser.name}</b> 🙂, You can reset Your Email from Link Down Below.</p> 
          <a href="${config_1.default.baseUrl}/reset/${token}" style="background: #a855f7; padding: 10px; text-decoration: none; color: white;">Reset Password</a>
        </div>
      `,
        };
        yield (0, email_service_1.default)(mailOptions);
        response.status(200).json({ message: "Check you email address!" });
    }
    catch (error) {
        next(error);
    }
});
const getNewPassword = ({ params }, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resetToken } = params;
        const targetUser = yield user_model_1.default.findOne({
            resetToken: resetToken,
            resetTokenExpiration: {
                $gt: Date.now(),
            },
        });
        if (!targetUser) {
            return response.status(404).json({
                message: "Sorry, User does not exist, Or you entered invalid things.",
            });
        }
        response
            .status(200)
            .json({ userId: targetUser._id.toString(), resetToken });
    }
    catch (error) {
        next(error);
    }
});
const postNewPassword = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, newPassword, resetToken } = request.body;
        // validation
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const targetUser = yield user_model_1.default.findOne({
            _id: userId,
            resetToken: resetToken,
            resetTokenExpiration: {
                $gt: Date.now(),
            },
        });
        if (!targetUser) {
            return response.status(404).json({ message: "User does not exist!" });
        }
        targetUser.password = newPassword;
        targetUser.resetToken = undefined;
        targetUser.resetTokenExpiration = undefined;
        yield targetUser.save();
        response.status(201).json({ message: "Your Password Update Successfully" });
    }
    catch (error) {
        next(error);
    }
});
const postRegister = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, file } = request;
        const { name, email, password, role } = body;
        const userImage = file;
        // validation
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const newUser = yield user_model_1.default.create({
            name,
            email,
            password,
            role,
            image: `${config_1.default.baseUrl}/images/${userImage.originalname}`,
        });
        const { name: userName, email: userEmail, image: usrImage } = newUser;
        response
            .status(201)
            .json({ name: userName, email: userEmail, image: usrImage });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postLogin,
    postLogout,
    postReset,
    postNewPassword,
    getNewPassword,
    postRegister,
};
