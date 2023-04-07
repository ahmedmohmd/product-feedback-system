"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generate = (length) => {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(length, (error, buffer) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(buffer.toString("hex"));
        });
    });
};
exports.default = generate;
