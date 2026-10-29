import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination";

const title = z.string().trim().min(5).max(120);
const body = z.string().trim().min(20);
const status = z.enum(["draft", "published"]);
const tags = z
  .array(z.string().trim().toLowerCase().min(1).max(30))
  .max(5)
  .transform((t) => [...new Set(t)]); // remove duplicates

export const createPostSchema = z.strictObject({
  title,
  body,
  tags: tags.optional(),
  status: status.optional(),
});

// no defaults here, so a PATCH never resets fields the client didn't send
export const updatePostSchema = z
  .strictObject({
    title: title.optional(),
    body: body.optional(),
    tags: tags.optional(),
    status: status.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });

export const listPostsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  tag: z.string().trim().toLowerCase().optional(),
  sort: z.enum(["newest", "oldest", "mostCommented"]).default("newest"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
