import express from "express";
import authController from "../controllers/auth.controller";
const router = express.Router();

router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.get("/reset/:resetToken", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
router.post("/register", authController.postRegister);

export default router;
