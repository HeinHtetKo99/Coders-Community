import { z } from "zod";

export const signInWithCredentialsSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
