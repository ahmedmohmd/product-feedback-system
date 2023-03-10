import express from "express";
import authController from "../controllers/auth.controller";
const router = express.Router();

router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);

export default router;
