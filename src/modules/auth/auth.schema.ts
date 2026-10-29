import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string().min(1),
});
