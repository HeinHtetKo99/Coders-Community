"use server";

import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import mongoose from "mongoose";
import Answer, { IanswerDoc } from "@/database/Answer.model";
import { createAnswerSchema } from "../schemas/createAnswerSchema";
import { actionErrorResponse } from "../response";
import Question from "@/database/Question.model";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import Routes from "@/routes";
import User from "@/database/User.model";
import { reputationRules } from "../reputation/config";
import { revalidateCacheTags } from "../cache";

const applyReputationDelta = async (userId: string, delta: number) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;

  const user = await User.findById(userId).select("reputation").lean();
  if (!user) return;

  await User.findByIdAndUpdate(userId, {
    reputation: Math.max(0, Number(user.reputation || 0) + delta),
  });
};

export async function createAnswer(params: {
  questionId: string;
  content: string;
}): Promise<{
  success: boolean;
  data?: IanswerDoc;
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const auth_session = await auth();
  const userId = auth_session?.user?.id;
  let validatedData: { data: { questionId: string; content: string } };
  try {
    validatedData = handleValidation(params, createAnswerSchema) as unknown as {
      data: { questionId: string; content: string };
    };
  } catch (e) {
    return actionErrorResponse(e);
  }

  const { questionId, content } = validatedData.data;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      throw new Error("Question not found");
    }
    const [answer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session }
    );
    if (!answer) {
      throw new Error("Answer not created");
    }
    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { answers: 1 } },
      { session }
    );
    await session.commitTransaction();

    const answerJson = JSON.parse(JSON.stringify(answer));

    try {
      await applyReputationDelta(
        String(userId || ""),
        reputationRules.answer.create
      );
      revalidatePath(Routes.Home);
      revalidatePath(Routes.questions);
      revalidatePath(Routes.question_details(questionId));
      revalidatePath(Routes.userProfile(String(userId || "")));
      revalidateCacheTags(["questions:list", `question:${questionId}`]);
    } catch {}

    return {
      success: true,
      data: answerJson,
    };
  } catch (e) {
    await session.abortTransaction();
    return actionErrorResponse(e);
  } finally {
    await session.endSession();
  }
}
