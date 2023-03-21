import express from "express";
import { body } from "express-validator";
import authController from "../controllers/auth.controller";
const router = express.Router();

router.post(
  "/login",
  body("email").trim().isEmail(),
  body("password").isStrongPassword().isLength({
    max: 15,
    min: 8,
  }),
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post("/reset", body("email").trim().isEmail(), authController.postReset);
router.get("/reset/:resetToken", authController.getNewPassword);
router.post(
  "/new-password",
  body("newPassword").isStrongPassword().isLength({
    max: 15,
    min: 8,
  }),
  authController.postNewPassword
);
router.post(
  "/register",
  body("email").trim().isEmail(),
  body("password").isStrongPassword().isLength({
    max: 15,
    min: 8,
  }),
  authController.postRegister
);

export default router;
