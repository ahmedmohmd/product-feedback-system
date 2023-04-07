"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_controller_1 = __importDefault(require("../controllers/error-handler.controller"));
const router = express_1.default.Router();
router.use(error_handler_controller_1.default);
exports.default = router;
