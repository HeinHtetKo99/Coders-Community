import z from "zod";

export const getTagQuestionsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  tagId: z.string(),
});
