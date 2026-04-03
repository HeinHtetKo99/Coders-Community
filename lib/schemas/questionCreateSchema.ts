import { z } from "zod";

export const questionCreateSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(5, { message: "Title must be at least 5 characters" })
    .max(150, { message: "Title cannot exceed 150 characters" }),
  content: z
    .string({ message: "Content is required" })
    .min(10, { message: "Content must be at least 10 characters" }),
  tags: z
    .array(
      z
        .string({ message: "Tag is required" })
        .min(1, { message: "Tag is required" })
        .max(30, { message: "Tag cannot exceed 30 characters" })
    )
    .min(1, { message: "At least one tag is required" })
    .max(5, { message: "You can add up to 5 tags" }),
});
