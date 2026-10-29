import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError";
import { OBJECT_ID_RE } from "../utils/objectId";

export const validateObjectId =
  (param = "id"): RequestHandler =>
  (req, _res, next) => {
    const value = req.params[param];
    if (typeof value !== "string" || !OBJECT_ID_RE.test(value)) {
      return next(new AppError(400, `Invalid ${param}`));
    }
    next();
  };
