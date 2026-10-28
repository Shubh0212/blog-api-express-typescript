import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { validateObjectId } from "../../middlewares/validateObjectId";
import { commentsController } from "./comments.controller";
import { createCommentSchema } from "./comments.schema";

export const postCommentsRouter = Router({ mergeParams: true }); // gets :id from the parent path
postCommentsRouter.get("/", validateObjectId(), commentsController.list);
postCommentsRouter.post(
  "/",
  authenticate,
  validateObjectId(),
  validateBody(createCommentSchema),
  commentsController.create,
);

export const commentsRouter = Router();
commentsRouter.delete(
  "/:id",
  authenticate,
  validateObjectId(),
  commentsController.remove,
);
