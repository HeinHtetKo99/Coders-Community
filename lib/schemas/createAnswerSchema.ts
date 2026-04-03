import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z
    .string({ message: "Question ID is required" })
    .min(1, "Question ID is required"),
  content: z
    .string({ message: "Content is required" })
    .min(1, "Content is required"),
});
