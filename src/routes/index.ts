import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import {
  commentsRouter,
  postCommentsRouter,
} from "../modules/comments/comments.routes";
import postsRoutes from "../modules/posts/posts.routes";
import statsRoutes from "../modules/stats/stats.routes";
import usersRoutes from "../modules/users/users.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/posts/:id/comments", postCommentsRouter);
router.use("/posts", postsRoutes);
router.use("/comments", commentsRouter);
router.use("/stats", statsRoutes);

export default router;
