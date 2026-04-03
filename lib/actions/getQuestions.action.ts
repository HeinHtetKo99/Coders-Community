/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import Question, { IquestionDoc } from "@/database/Question.model";
import Tags from "@/database/Tag.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { paginatedSearchSchema } from "../schemas/paginatedSearchSchema";
import { QueryFilter } from "mongoose";
import { actionErrorResponse } from "../response";
export async function getQuestions(params: {
  page?: number;
  pageSize?: number;
  filter?: string;
  search?: string;
  sort?: string;
}): Promise<{
  data?: {
    questions: IquestionDoc[];
    isNext: boolean;
  };
  success: boolean;
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, paginatedSearchSchema);
  const { page = 1, pageSize = 10, filter, search, sort } = validatedData.data;

  const skip = Number(page - 1) * pageSize;
  const limit = Number(pageSize);
  const pageLimit = limit + 1;

  const filterQuery: QueryFilter<typeof Question> = {};
  const recognizedSortFilters = [
    "newest",
    "unanswered",
    "popular",
    "recommended",
  ];

  if (filter == "recommended") {
    return {
      data: {
        questions: [],
        isNext: false,
      },
      success: true,
    };
  }

  if (search) {
    filterQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  try {
    if (filter && !recognizedSortFilters.includes(filter)) {
      const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const tag = await Tags.findOne({
        name: { $regex: new RegExp(`^${escapedFilter}$`, "i") },
      }).select("_id");

      if (!tag?._id) {
        return {
          data: {
            questions: [],
            isNext: false,
          },
          success: true,
        };
      }

      filterQuery.tags = tag._id;
      sortCriteria = { createdAt: -1 };
    } else {
      switch (filter) {
        case "newest":
          sortCriteria = { createdAt: -1 };
          break;
        case "unanswered":
          filterQuery.answers = 0;
          sortCriteria = { createdAt: -1 };
          break;
        case "popular":
          sortCriteria = { upvotes: -1 };
          break;
        default:
          sortCriteria = { createdAt: -1 };
          break;
      }
    }

    const questions = await Question.find(filterQuery)
      .select("title tags views upvotes answers author createdAt")
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageLimit);
    const isNext = questions.length > limit;
    const paginatedQuestions = isNext ? questions.slice(0, limit) : questions;
    return {
      data: {
        questions: paginatedQuestions as IquestionDoc[],
        isNext,
      },
      success: true,
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
