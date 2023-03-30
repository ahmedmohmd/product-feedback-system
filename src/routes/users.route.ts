import express from "express";
import usersController from "../controllers/users.controller";
import auth from "../middlewares/auth.middleware";
import validator from "../middlewares/validate.middleware";
const router = express.Router();

router.get("/", auth.authUser, usersController.getSingleUser);
router.patch(
  "/",
  auth.authUser,
  validator.validatePassword(),
  usersController.patchUser
);
router.delete("/", auth.authUser, usersController.deleteUser);

export default router;
