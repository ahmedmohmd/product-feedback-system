import express from "express";
import usersController from "../controllers/users.controller";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:userId", usersController.getSingleUser);
router.post("/", usersController.postUser);
router.patch("/:userId", usersController.patchUser);
router.delete("/:userId", usersController.deleteUser);

export default router;
