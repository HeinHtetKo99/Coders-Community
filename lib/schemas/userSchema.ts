import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3).max(20),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  image: z.string().url().optional(),
});
