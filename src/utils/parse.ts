import type { z, ZodType } from "zod";
import { AppError } from "./AppError";

export const parseOrThrow = <T extends ZodType>(
  schema: T,
  data: unknown,
): z.output<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join(".");
    throw new AppError(
      400,
      field ? `${field}: ${issue.message}` : issue.message,
    );
  }
  return result.data;
};
