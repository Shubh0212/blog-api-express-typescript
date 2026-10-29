import type { Request, Response } from "express";
import { statsService } from "./stats.service";

export const statsController = {
  async get(_req: Request, res: Response) {
    res.json({ success: true, data: await statsService.getStats() });
  },
};
