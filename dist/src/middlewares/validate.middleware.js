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
const user_model_1 = __importDefault(require("../models/user.model"));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["USER_EXISTS"] = "Sorry, this email already exists!";
    ErrorMessages["INVALID_PASSWORD"] = "Sorry, your password is incorrect. Please try again";
    ErrorMessages["INVALID_EMAIL"] = "Sorry, your email address is invalid or already exists!";
})(ErrorMessages || (ErrorMessages = {}));
const validateEmail = (custom = false) => {
    if (!custom) {
        return (0, express_validator_1.body)("email")
            .trim()
            .isEmail()
            .withMessage(ErrorMessages.INVALID_EMAIL);
    }
    return (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const targetUser = yield user_model_1.default.findOne({
            email: value,
        });
        if (targetUser) {
            return Promise.reject("Sorry, this email already exists!");
        }
    }))
        .withMessage(ErrorMessages.INVALID_EMAIL);
};
const validatePassword = (passwordFieldName = "password") => {
    return (0, express_validator_1.body)(passwordFieldName)
        .isStrongPassword()
        .isLength({
        max: 15,
        min: 8,
    })
        .withMessage(ErrorMessages.INVALID_PASSWORD);
};
exports.default = {
    validateEmail,
    validatePassword,
};
