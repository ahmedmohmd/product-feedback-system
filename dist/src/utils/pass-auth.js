"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT = 10;
const encrypt = (plainText) => {
    return bcrypt_1.default.hash(plainText, SALT);
};
const check = (inputText, hashedText) => {
    return bcrypt_1.default.compare(inputText, hashedText);
};
exports.default = {
    encrypt,
    check,
};
