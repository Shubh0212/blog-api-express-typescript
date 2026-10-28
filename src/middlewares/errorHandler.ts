import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON body" });
  }
  console.error(err);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
};
