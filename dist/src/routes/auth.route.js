"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const router = express_1.default.Router();
router.post("/login", validate_middleware_1.default.validateEmail(), validate_middleware_1.default.validatePassword(), auth_controller_1.default.postLogin);
router.post("/logout", auth_controller_1.default.postLogout);
router.post("/reset", (0, express_validator_1.body)("email").trim().isEmail(), auth_controller_1.default.postReset);
router.get("/reset/:resetToken", auth_controller_1.default.getNewPassword);
router.post("/new-password", validate_middleware_1.default.validatePassword("newPassword"), auth_controller_1.default.postNewPassword);
router.post("/register", validate_middleware_1.default.validateEmail(true), validate_middleware_1.default.validatePassword(), auth_controller_1.default.postRegister);
exports.default = router;
