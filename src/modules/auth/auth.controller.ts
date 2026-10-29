import type { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async signup(req: Request, res: Response) {
    const user = await authService.signup(req.body);
    res.status(201).json({ success: true, data: user });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(
      email,
      password,
      req.get("user-agent") ?? "",
    );
    res.status(200).json({
      success: true,
      data: {
        token: result.token,
        expiresAt: result.expiresAt,
        user: result.user,
      },
    });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.session!.token);
    res.status(200).json({ success: true, message: "Logged out" });
  },
};
