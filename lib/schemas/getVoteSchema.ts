import z from "zod";

export const getVoteSchema = z.object({
  typeId: z.string().min(1),
  type: z.enum(["question", "answer"]),
});
