import type { Request, Response } from "express";
import { userRepository } from "../../repositories/user.repository";
import { AppError } from "../../utils/AppError";

export const usersController = {
  async getMe(req: Request, res: Response) {
    res.json({ success: true, data: req.user });
  },

  async updateMe(req: Request, res: Response) {
    const updated = await userRepository.updateName(
      req.user!.id,
      req.body.name,
    );
    if (!updated) throw new AppError(404, "User not found");
    res.json({ success: true, data: updated });
  },
};
