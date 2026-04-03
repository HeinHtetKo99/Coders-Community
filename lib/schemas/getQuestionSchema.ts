import { z } from "zod";

export const getQuestionSchema = z.object({
  questionId: z.string({ message: "Question ID is required" }),
});
