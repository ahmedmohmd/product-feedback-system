"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.get("/users", auth_middleware_1.default.authUser, auth_middleware_1.default.authAdmin, admin_controller_1.default.getUsers);
router.delete("/:userId", auth_middleware_1.default.authUser, auth_middleware_1.default.authAdmin, admin_controller_1.default.postDeleteUser);
exports.default = router;
