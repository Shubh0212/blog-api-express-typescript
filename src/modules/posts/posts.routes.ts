import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { validateObjectId } from "../../middlewares/validateObjectId";
import { postsController } from "./posts.controller";
import { createPostSchema, updatePostSchema } from "./posts.schema";

const router = Router();

router.get("/", postsController.list);
router.post(
  "/",
  authenticate,
  validateBody(createPostSchema),
  postsController.create,
);
router.get("/:id", validateObjectId(), postsController.getOne);
router.patch(
  "/:id",
  authenticate,
  validateObjectId(),
  validateBody(updatePostSchema),
  postsController.update,
);
router.delete("/:id", authenticate, validateObjectId(), postsController.remove);

export default router;
