import z from "zod";

export const getUserAnswersSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  page: z.number().min(1, "Page number must be at least 1"),
  pageSize: z.number().min(1, "Page size must be at least 1"),
});
