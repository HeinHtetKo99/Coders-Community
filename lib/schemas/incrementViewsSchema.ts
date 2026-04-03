import { z } from "zod";

export const incrementViewsSchema = z.object({
  questionId: z.string({ message: "Question ID is required" }),
});
