import express from "express";
import { body } from "express-validator";
import authController from "../controllers/auth.controller";
import validator from "../middlewares/validate.middleware";
const router = express.Router();

router.post(
  "/login",
  validator.validateEmail(),
  validator.validatePassword(),
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post("/reset", body("email").trim().isEmail(), authController.postReset);
router.get("/reset/:resetToken", authController.getNewPassword);
router.post(
  "/new-password",
  validator.validatePassword("newPassword"),
  authController.postNewPassword
);
router.post(
  "/register",
  validator.validateEmail(true),
  validator.validatePassword(),
  authController.postRegister
);

export default router;
