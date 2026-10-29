import type { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { AppError } from "../utils/AppError";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, "Route not found"));
};

const send = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) return send(res, err.statusCode, err.message);
  if (err instanceof SyntaxError && "body" in err)
    return send(res, 400, "Invalid JSON body");
  if (err instanceof MongooseError.ValidationError) {
    return send(
      res,
      400,
      Object.values(err.errors)[0]?.message ?? "Validation failed",
    );
  }
  if (err instanceof MongooseError.CastError)
    return send(res, 400, `Invalid ${err.path}`);
  if (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === 11000
  ) {
    return send(res, 409, "Duplicate value");
  }

  console.error(err); // logged server-side only, never sent to the client
  return send(res, 500, "Internal server error");
};
