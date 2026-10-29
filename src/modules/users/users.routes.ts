import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { usersController } from "./users.controller";
import { updateMeSchema } from "./users.schema";
import { postsController } from "../posts/posts.controller";

const router = Router();

router.get("/me", authenticate, usersController.getMe);
router.get("/me/posts", authenticate, postsController.listMine);
router.patch(
  "/me",
  authenticate,
  validateBody(updateMeSchema),
  usersController.updateMe,
);
// Part 3 will add GET /me/posts here, above any /:id routes

export default router;
