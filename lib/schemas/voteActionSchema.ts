import { z } from "zod";

export const voteActionSchema = z.object({
  type: z.enum(["question", "answer"], { message: "Type is required" }),
  typeId: z
    .string({ message: "Type ID is required" })
    .min(1, "Type ID is required"),
  voteType: z.enum(["upvote", "downvote"], {
    message: "Vote type is required",
  }),
});
