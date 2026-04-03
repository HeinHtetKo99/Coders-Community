"use server";

import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { paginatedSearchSchema } from "../schemas/paginatedSearchSchema";
import { QueryFilter } from "mongoose";
import { actionErrorResponse } from "../response";
import User, { Iuser } from "@/database/User.model";

export async function getUsers(params: {
  page?: number;
  pageSize?: number;
  filter?: string;
  search?: string;
  sort?: string;
}): Promise<{
  data?: {
    users: Iuser[];
    isNext: boolean;
  };
  success: boolean;
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, paginatedSearchSchema);
  const { page = 1, pageSize = 10, filter, search } = validatedData.data;

  const skip = Number(page - 1) * pageSize;
  const limit = Number(pageSize);
  const pageLimit = limit + 1;

  const filterQuery: QueryFilter<typeof User> = {};

  if (search) {
    filterQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  let sortCriteria = {};
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const users = await User.find(filterQuery)
      .select("name image reputation createdAt")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageLimit);
    const isNext = users.length > limit;
    const paginatedUsers = isNext ? users.slice(0, limit) : users;
    return {
      data: {
        users: paginatedUsers as Iuser[],
        isNext,
      },
      success: true,
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
