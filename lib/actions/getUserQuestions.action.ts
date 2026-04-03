"use server";

import Question, { IquestionDoc } from "@/database/Question.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { actionErrorResponse } from "../response";
import { getUserQuestionsSchema } from "../schemas/getUserQuestionsSchema";

export async function getUserQuestions(params: {
  userId: string;
  page: number;
  pageSize: number;
}): Promise<{
  success: boolean;
  data?: {
    questions: IquestionDoc[];
    isNext: boolean;
  };
  details?: object | null;
  message?: string | null;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getUserQuestionsSchema);
  const { userId, page, pageSize } = validatedData.data;
  const skip = Number(page - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const pageLimit = limit + 1;
  try {
    const questions = await Question.find({ author: userId })
      .select("title tags views upvotes answers author createdAt")
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .skip(skip)
      .limit(pageLimit);
    const isNext = questions.length > limit;
    const paginatedQuestions = isNext ? questions.slice(0, limit) : questions;

    return {
      success: true,
      data: {
        questions: paginatedQuestions as IquestionDoc[],
        isNext,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
