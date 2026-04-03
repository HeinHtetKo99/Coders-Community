"use server";

import Answer, { Ianswer } from "@/database/Answer.model";
import Vote from "@/database/Vote.model";
import { auth } from "@/auth";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { getAnswersSchema } from "../schemas/getAnswersSchema";
import { actionErrorResponse } from "../response";
import mongoose from "mongoose";

export async function getAnswers(params: {
  page?: number;
  pageSize?: number;
  filter?: string;
  questionId: string;
}): Promise<{
  success: boolean;
  data?: {
    totalAnswers: number;
    answers: Ianswer[];
    isNext: boolean;
  };
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getAnswersSchema);
  const { page, pageSize, filter, questionId } = validatedData.data;
  const skip = Number(page - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const authSessionPromise = auth();
    const [totalAnswers, answers, authSession] = await Promise.all([
      Answer.countDocuments({ question: questionId }),
      Answer.find({ question: questionId })
        .populate("author", "name image")
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .lean(),
      authSessionPromise,
    ]);

    const sessionUserId = authSession?.user?.id;
    const answerIds = answers.map((answer) => answer._id);
    const hasValidSessionUserId =
      typeof sessionUserId === "string" &&
      mongoose.Types.ObjectId.isValid(sessionUserId);

    let voteTypeByAnswerId = new Map<string, "upvote" | "downvote">();

    if (hasValidSessionUserId && answerIds.length > 0) {
      const votes = await Vote.find({
        author: sessionUserId,
        type: "answer",
        type_id: { $in: answerIds },
      })
        .select("type_id voteType")
        .lean();

      voteTypeByAnswerId = new Map(
        votes.map((vote) => [String(vote.type_id), vote.voteType])
      );
    }

    const answersWithVotes = answers.map((answer) => ({
      ...answer,
      userVote: voteTypeByAnswerId.get(String(answer._id)) || null,
    }));

    const isNext = skip + limit < totalAnswers;
    return {
      success: true,
      data: {
        totalAnswers,
        isNext,
        answers: answersWithVotes as Ianswer[],
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
