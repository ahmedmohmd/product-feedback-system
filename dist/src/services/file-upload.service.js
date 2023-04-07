"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (_, file, cb) => {
        cb(null, path_1.default.join(process.cwd() + "/src/images/"));
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const fileFilter = (_, file, cb) => {
    const isValidFile = file.mimetype === "image/jpeg" || file.mimetype === "image/png";
    cb(null, isValidFile);
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
}).single("image");
exports.default = upload;
