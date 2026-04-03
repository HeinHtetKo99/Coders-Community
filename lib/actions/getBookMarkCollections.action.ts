"use server";

import mongoose, { PipelineStage } from "mongoose";

import dbConnect from "../dbConnect";
import { auth } from "@/auth";
import Collection, { Icollection } from "@/database/Collection.model";
import { handleValidation } from "../handleValidation";
import { paginatedSearchSchema } from "../schemas/paginatedSearchSchema";
import { actionErrorResponse } from "../response";

const getBookMarkCollections = async (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
  sort?: string;
}): Promise<{
  data?: {
    collections: Icollection[];
    isNext: boolean;
  };
  success: boolean;
  message?: string;
  details?: object | null;
}> => {
  await dbConnect();
  const auth_session = await auth();
  const sessionUserId = auth_session?.user?.id;
  const sessionUserEmail = auth_session?.user?.email;

  let userId = null;
  if (sessionUserId && mongoose.Types.ObjectId.isValid(sessionUserId)) {
    userId = sessionUserId;
  } else if (sessionUserEmail) {
    const existingUser = await mongoose
      .model("User")
      .findOne({
        email: sessionUserEmail,
      })
      .select("_id");
    userId = existingUser?._id;
  }

  if (!userId) {
    return {
      success: true,
      data: { collections: [], isNext: false },
    };
  }

  const validatedData = handleValidation(params, paginatedSearchSchema);

  const { page = 1, pageSize = 10, search, filter } = validatedData.data;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  // Define sort options for all filters
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter] || sortOptions.mostrecent;

  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { author: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      // Unwind author
      { $unwind: "$question.author" },
      // Lookup tags
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    // Apply search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: search, $options: "i" } },
            { "question.content": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Get total count before pagination
    const [totalCountResult] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]); // [{count : 10}]

    const totalCollections = totalCountResult?.count || 0;

    // Add sorting and pagination &  Execute aggregation
    const collections = await Collection.aggregate([
      ...pipeline,
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: limit },
    ]); // []

    const isNext = totalCollections > skip + collections.length;

    return {
      success: true,
      data: {
        collections: JSON.parse(JSON.stringify(collections)),
        isNext,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
};

export default getBookMarkCollections;
