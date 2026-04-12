"use server";

import Answer from "@/database/Answer.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { actionErrorResponse } from "../response";
import { deleteAnswerSchema } from "../schemas/deleteAnswerSchema";
import Question from "@/database/Question.model";
import Vote from "@/database/Vote.model";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
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

export async function deleteAnswerAction(params: {
  answerId: string;
}): Promise<{ success: boolean; message?: string }> {
  await dbConnect();
  const auth_session = await auth();
  const userId = auth_session?.user?.id;
  const validatedData = handleValidation(params, deleteAnswerSchema);
  const { answerId } = validatedData.data;
  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return actionErrorResponse("Answer not found");
    if (String(answer.author) !== String(userId || "")) {
      return actionErrorResponse("Not authorized");
    }

    await Question.findByIdAndUpdate(
      { _id: answer.question },
      { $inc: { answers: -1 } },
      { new: true }
    );

    await Vote.deleteMany({ type_id: answerId, type: "answer" });
    await Answer.findByIdAndDelete(answerId);
    const answerContribution =
      reputationRules.answer.create +
      Number(answer.upvotes || 0) * reputationRules.answer.upvote +
      Number(answer.downvotes || 0) * reputationRules.answer.downvote;
    await applyReputationDelta(String(answer.author), -answerContribution);
    revalidatePath(Routes.Home);
    revalidatePath(Routes.questions);
    revalidatePath(Routes.question_details(String(answer.question)));
    revalidatePath(Routes.userProfile(userId as string));
    revalidateCacheTags([
      "questions:list",
      `question:${String(answer.question)}`,
    ]);
    return { success: true };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
