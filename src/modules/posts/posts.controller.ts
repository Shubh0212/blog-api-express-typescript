import type { Request, Response } from "express";
import { paginationQuerySchema } from "../../utils/pagination";
import { parseOrThrow } from "../../utils/parse";
import { listPostsQuerySchema } from "./posts.schema";
import { postService } from "./posts.service";

const idOf = (req: Request) => req.params.id as string;

export const postsController = {
  async create(req: Request, res: Response) {
    const post = await postService.create(req.user!, req.body);
    res.status(201).json({ success: true, data: post });
  },

  async list(req: Request, res: Response) {
    const query = parseOrThrow(listPostsQuerySchema, req.query);
    const result = await postService.list(query);
    res.json({ success: true, ...result });
  },

  async getOne(req: Request, res: Response) {
    const post = await postService.getPublished(idOf(req));
    res.json({ success: true, data: post });
  },

  async update(req: Request, res: Response) {
    const post = await postService.update(req.user!, idOf(req), req.body);
    res.json({ success: true, data: post });
  },

  async remove(req: Request, res: Response) {
    await postService.remove(req.user!, idOf(req));
    res.json({ success: true, message: "Post deleted" });
  },

  async listMine(req: Request, res: Response) {
    const { page, limit } = parseOrThrow(paginationQuerySchema, req.query);
    const result = await postService.listMine(req.user!, page, limit);
    res.json({ success: true, ...result });
  },
};
