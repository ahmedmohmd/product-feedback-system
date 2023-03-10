import express from "express";
import usersController from "../controllers/users.controller";
import auth from "../middlewares/auth.middware";
import authRole from "../middlewares/role.middlware";

const router = express.Router();

router.get("/", auth, authRole("admin"), usersController.getUsers);
router.get("/:userId", auth, usersController.getSingleUser);
router.post("/", usersController.postUser);
router.patch("/:userId", auth, usersController.patchUser);
router.delete("/:userId", auth, usersController.deleteUser);

export default router;
