import express from "express";
import errorHandlerController from "../controllers/error-handler.controller";
const router = express.Router();

router.use(errorHandlerController);

export default router;
