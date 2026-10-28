import type { RequestHandler } from "express";
import { sessionRepository } from "../repositories/session.repository";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new AppError(401, "Authentication required");
  }

  const session = await sessionRepository.findByToken(token);
  // TTL cleanup runs only about once a minute, so always check expiry ourselves
  if (!session || session.expiresAt.getTime() <= Date.now()) {
    throw new AppError(401, "Invalid or expired session");
  }

  const user = await userRepository.findById(session.userId.toString());
  if (!user) throw new AppError(401, "Invalid or expired session");

  req.session = session;
  req.user = user;
  next();
};
