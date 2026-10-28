import { z } from "zod";
import { OBJECT_ID_RE } from "../../utils/objectId";
import { paginationQuerySchema } from "../../utils/pagination";

export const createCommentSchema = z.strictObject({
  text: z.string().trim().min(1).max(500),
});

export const listCommentsQuerySchema = paginationQuerySchema.extend({
  after: z.string().regex(OBJECT_ID_RE, "Invalid cursor").optional(),
});
