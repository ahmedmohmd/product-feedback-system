import express from "express";
import notFound from "../controllers/not-found.controller";
const router = express.Router();

router.get("*", notFound);

export default router;
