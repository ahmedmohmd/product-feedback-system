import express from "express";
import usersController from "../controllers/users.controller";
import auth from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/:userId", auth.authUser, usersController.getSingleUser);
router.patch("/:userId", auth.authUser, usersController.patchUser);
router.delete("/:userId", auth.authUser, usersController.deleteUser);

export default router;
