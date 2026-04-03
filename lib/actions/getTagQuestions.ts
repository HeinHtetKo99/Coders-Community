"use server";

import Question, { IquestionDoc } from "@/database/Question.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { QueryFilter } from "mongoose";
import { actionErrorResponse } from "../response";
import Tags, { ItagsDoc } from "@/database/Tag.model";
import { getTagQuestionsSchema } from "../schemas/getTagQuestionsSchema";
export async function getTagQuestions(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  tagId?: string;
}): Promise<{
  data?: {
    tags: ItagsDoc;
    questions: IquestionDoc[];
    isNext: boolean;
  };
  success: boolean;
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getTagQuestionsSchema);
  const { tagId, page = 1, pageSize = 10, search } = validatedData.data;

  const skip = Number(page - 1) * pageSize;
  const limit = Number(pageSize);
  const pageLimit = limit + 1;
  const tags = await Tags.findById(tagId);
  if (!tags) throw new Error("Tag not found");

  const filterQuery: QueryFilter<typeof Question> = {
    tags: {
      $in: [tagId],
    },
  };

  if (search) {
    filterQuery.title = { $regex: search, $options: "i" };
  }

  try {
    const questions = await Question.find(filterQuery)
      .select("title tags upvotes answers createdAt views author")
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .skip(skip)
      .limit(pageLimit);
    const isNext = questions.length > limit;
    const paginatedQuestions = isNext ? questions.slice(0, limit) : questions;
    return {
      data: {
        tags: tags as ItagsDoc,
        questions: paginatedQuestions as IquestionDoc[],
        isNext,
      },
      success: true,
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
