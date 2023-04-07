"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default.authUser, users_controller_1.default.getSingleUser);
router.patch("/", auth_middleware_1.default.authUser, validate_middleware_1.default.validatePassword(), users_controller_1.default.patchUser);
router.delete("/", auth_middleware_1.default.authUser, users_controller_1.default.deleteUser);
exports.default = router;
