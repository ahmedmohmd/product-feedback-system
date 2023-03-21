import express from "express";
import usersController from "../controllers/users.controller";
import auth from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/", auth.authUser, usersController.getSingleUser);
router.patch("/", auth.authUser, usersController.patchUser);
router.delete("/", auth.authUser, usersController.deleteUser);

export default router;
