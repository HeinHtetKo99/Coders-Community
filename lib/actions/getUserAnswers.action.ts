"use server";

import Answer, { Ianswer } from "@/database/Answer.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { actionErrorResponse } from "../response";
import { getUserAnswersSchema } from "../schemas/getUserAnswersSchema";

export async function getUserAnswers(params: {
  userId: string;
  page: number;
  pageSize: number;
}): Promise<{
  success: boolean;
  data?: {
    answers: Ianswer[];
    isNext: boolean;
  };
  details?: object | null;
  message?: string | null;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getUserAnswersSchema);
  const { userId, page, pageSize } = validatedData.data;
  const skip = Number(page - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const pageLimit = limit + 1;
  try {
    const answers = await Answer.find({ author: userId })
      .select("author question content upvotes downvotes createdAt")
      .populate("author", "_id name image")
      .populate("question", "_id title")
      .lean()
      .skip(skip)
      .limit(pageLimit);
    const isNext = answers.length > limit;
    const paginatedAnswers = isNext ? answers.slice(0, limit) : answers;

    return {
      success: true,
      data: {
        answers: paginatedAnswers as Ianswer[],
        isNext,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
