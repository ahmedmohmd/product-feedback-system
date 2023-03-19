import express from "express";
import adminController from "../controllers/admin.controller";
import auth from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/users", auth.authUser, auth.authAdmin, adminController.getUsers);
router.delete(
  "/:userId",
  auth.authUser,
  auth.authAdmin,
  adminController.postDeleteUser
);

export default router;
