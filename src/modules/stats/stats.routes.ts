import { Router } from "express";
import { statsController } from "./stats.controller";

const router = Router();
router.get("/", statsController.get);

export default router;
