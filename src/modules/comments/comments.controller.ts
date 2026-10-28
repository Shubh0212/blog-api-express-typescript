import type { Request, Response } from "express";
import { parseOrThrow } from "../../utils/parse";
import { listCommentsQuerySchema } from "./comments.schema";
import { commentService } from "./comments.service";

const idOf = (req: Request) => req.params.id as string;

export const commentsController = {
  async create(req: Request, res: Response) {
    const comment = await commentService.create(
      req.user!,
      idOf(req),
      req.body.text,
    );
    res.status(201).json({ success: true, data: comment });
  },

  async list(req: Request, res: Response) {
    const query = parseOrThrow(listCommentsQuerySchema, req.query);
    const result = await commentService.list(idOf(req), query);
    res.json({ success: true, ...result });
  },

  async remove(req: Request, res: Response) {
    await commentService.remove(req.user!, idOf(req));
    res.json({ success: true, message: "Comment deleted" });
  },
};
