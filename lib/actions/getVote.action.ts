"use server";

import { auth } from "@/auth";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { getVoteSchema } from "../schemas/getVoteSchema";
import { actionErrorResponse } from "../response";
import Vote from "@/database/Vote.model";

export async function getVote(params: {
  typeId: string;
  type: "question" | "answer";
}): Promise<{
  success: boolean;
  data?: {
    voteType?: "upvote" | "downvote" | null;
  };
  message?: string;
  details?: object | null;
}> {
  await dbConnect();
  const auth_session = await auth();
  const userId = auth_session?.user?.id;
  const validatedData = await handleValidation(params, getVoteSchema);
  const { typeId, type } = validatedData.data;

  try {
    if (!userId) {
      return { success: true, data: { voteType: null } };
    }

    const vote = await Vote.findOne({
      author: userId,
      type_id: typeId,
      type,
    })
      .select("voteType")
      .lean();

    return { success: true, data: { voteType: vote?.voteType || null } };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
