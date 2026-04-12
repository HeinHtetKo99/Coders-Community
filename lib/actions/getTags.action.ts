/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { paginatedSearchSchema } from "../schemas/paginatedSearchSchema";
import { QueryFilter } from "mongoose";
import { actionErrorResponse } from "../response";
import Tags, { ItagsDoc } from "@/database/Tag.model";
export async function getTags(params: {
  page?: number;
  pageSize?: number;
  filter?: string;
  search?: string;
  sort?: string;
}): Promise<{
  data?: {
    tags: ItagsDoc[];
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

  const filterQuery: QueryFilter<typeof Tags> = {};

  if (search) {
    filterQuery.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  let sortCriteria = {};
  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: -1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const tags = await Tags.find(filterQuery)
      .select("name questions createdAt")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageLimit);
    const isNext = tags.length > limit;
    const paginatedTags = isNext ? tags.slice(0, limit) : tags;
    return {
      data: {
        tags: paginatedTags as ItagsDoc[],
        isNext,
      },
      success: true,
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
