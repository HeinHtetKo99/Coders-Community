import z from "zod";

export const getUserQuestionsSchema = z.object({
  userId: z.string(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
});
