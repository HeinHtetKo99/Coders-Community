"use server";

import Question from "@/database/Question.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { actionErrorResponse } from "../response";
import { incrementViewsSchema } from "../schemas/incrementViewsSchema";

export default async function incrementViews(params: {
  questionId: string;
}): Promise<{
  success: boolean;
  data?: {
    views: number;
  };
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, incrementViewsSchema);
  const { questionId } = validatedData.data;
  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true, select: "views", lean: true }
    );
    if (!question) {
      throw new Error("Question not found");
    }
    return {
      success: true,
      data: {
        views: question.views,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
