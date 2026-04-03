import z from "zod";

export const toggleBookMarkSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});
