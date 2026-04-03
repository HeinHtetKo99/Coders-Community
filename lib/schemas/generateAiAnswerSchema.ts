import { z } from "zod";

export const generateAiAnswerSchema = z.object({
  content: z
    .string({ message: "Content is required" })
    .min(1, "Content is required"),
  title: z.string({ message: "Title is required" }).min(1, "Title is required"),
  userAnswer: z
    .string({ message: "User answer is required" })
    .min(1, "User answer is required"),
});
