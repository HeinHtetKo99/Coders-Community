"use server";

import User, { Iuser } from "@/database/User.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { actionErrorResponse } from "../response";
import { getUserSchema } from "../schemas/getUserSchema";
import Question from "@/database/Question.model";
import Answer from "@/database/Answer.model";

export async function getUser(params: { userId: string }): Promise<{
  success: boolean;
  data?: {
    user: Iuser;
    totalAnswers: number;
    totalQuestions: number;
  };
  error?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getUserSchema);
  const { userId } = validatedData.data;

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return actionErrorResponse("User not found");
    }

    const [totalAnswers, totalQuestions] = await Promise.all([
      Answer.countDocuments({ author: userId }).lean(),
      Question.countDocuments({ author: userId }).lean(),
    ]);

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalAnswers,
        totalQuestions,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
