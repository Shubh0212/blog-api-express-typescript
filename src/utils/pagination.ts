import { z } from "zod";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../constants/pagination";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .default(DEFAULT_LIMIT)
    .transform((n) => Math.min(n, MAX_LIMIT)), // limit above 50 is capped at 50
});

export const buildPagination = (
  page: number,
  limit: number,
  total: number,
) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
