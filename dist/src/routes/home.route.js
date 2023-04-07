"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const home_controller_1 = __importDefault(require("../controllers/home.controller"));
const router = express_1.default.Router();
router.get("/", home_controller_1.default);
exports.default = router;
