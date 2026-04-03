import { z } from "zod";

export const accountSchema = z.object({
  userId: z.string({ message: "User ID is required" }),
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  image: z
    .string()
    .url({ message: "Please provide a valid image URL" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  provider: z.string({ message: "Provider is required" }),
  providerAccountId: z.string({
    message: "Provider Account ID is required",
  }),
});
