import z from "zod";

export const getAnswersSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  filter: z.string().optional(),
  sort: z.string().optional(),
  questionId: z.string(),
});
