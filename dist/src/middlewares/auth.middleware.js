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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Sorry, you are not logged in!" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = yield jsonwebtoken_1.default.verify(token, "pythonista");
        console.log(decodedToken);
        request.user = decodedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
const authAdmin = (request, res, next) => {
    const user = request.user;
    const isAdmin = user.role === "admin";
    if (!isAdmin) {
        return res
            .status(403)
            .json({ message: "Sorry, you are not allowed to access this page." });
    }
    next();
};
exports.default = {
    authUser,
    authAdmin,
};
