"use server";

import { auth } from "@/auth";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { voteActionSchema } from "../schemas/voteActionSchema";
import { actionErrorResponse } from "../response";
import Answer from "@/database/Answer.model";
import Question from "@/database/Question.model";
import Vote from "@/database/Vote.model";
import { revalidatePath } from "next/cache";
import Routes from "@/routes";
import User from "@/database/User.model";
import { reputationRules } from "../reputation/config";
import { revalidateCacheTags } from "../cache";

const applyReputationDelta = async (userId: string, delta: number) => {
  const user = await User.findById(userId).select("reputation").lean();
  if (!user) return;

  await User.findByIdAndUpdate(userId, {
    reputation: Math.max(0, Number(user.reputation || 0) + delta),
  });
};

export async function voteAction(params: {
  type: "question" | "answer";
  typeId: string;
  voteType: "upvote" | "downvote" | null;
}): Promise<{
  success: boolean;
  data?: {
    upvotes: number;
    downvotes: number;
    userVote: "upvote" | "downvote" | null;
  };
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, voteActionSchema);
  const { type, typeId, voteType } = validatedData.data;

  try {
    const auth_session = await auth();
    const userId = auth_session?.user?.id;
    if (!userId) throw new Error("You must be logged in to vote");

    const Model = type === "question" ? Question : Answer;

    const existingVote = await Vote.findOne({
      author: userId,
      type_id: typeId,
      type,
    }).lean();

    const voteUpdate = { upvotes: 0, downvotes: 0 };
    let userVote: "upvote" | "downvote" | null = null;

    if (existingVote) {
      if (existingVote.voteType === voteType || voteType === null) {
        if (existingVote.voteType === "upvote") {
          voteUpdate.upvotes -= 1;
        } else {
          voteUpdate.downvotes -= 1;
        }
        await Vote.deleteOne({ _id: existingVote._id });
        userVote = null;
      } else {
        if (existingVote.voteType === "upvote") {
          voteUpdate.upvotes -= 1;
          voteUpdate.downvotes += 1;
        } else {
          voteUpdate.downvotes -= 1;
          voteUpdate.upvotes += 1;
        }
        await Vote.updateOne({ _id: existingVote._id }, { voteType });
        userVote = voteType;
      }
    } else {
      if (voteType === "upvote") {
        voteUpdate.upvotes += 1;
      }
      if (voteType === "downvote") {
        voteUpdate.downvotes += 1;
      }

      if (voteType) {
        await Vote.create({
          author: userId,
          type_id: typeId,
          type,
          voteType,
        });
        userVote = voteType;
      }
    }

    const updatedItem = await Model.findByIdAndUpdate(
      typeId,
      { $inc: voteUpdate },
      { new: true, select: "upvotes downvotes author", lean: true }
    );
    if (!updatedItem) throw new Error("item not found");
    const rules =
      type === "question" ? reputationRules.question : reputationRules.answer;
    const reputationDelta =
      voteUpdate.upvotes * rules.upvote + voteUpdate.downvotes * rules.downvote;
    await applyReputationDelta(String(updatedItem.author), reputationDelta);
    if (type === "question") {
      revalidatePath(Routes.Home);
      revalidatePath(Routes.questions);
      revalidatePath(Routes.question_details(typeId));
    }
    revalidateCacheTags(["questions:list", `question:${typeId}`]);

    return {
      success: true,
      data: {
        upvotes: Math.max(0, updatedItem.upvotes || 0),
        downvotes: Math.max(0, updatedItem.downvotes || 0),
        userVote,
      },
    };
  } catch (error) {
    return actionErrorResponse(error);
  }
}
