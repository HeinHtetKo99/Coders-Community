"use server";

import Question, { Iquestion } from "@/database/Question.model";
import dbConnect from "../dbConnect";
import { actionErrorResponse } from "../response";
import Collection from "@/database/Collection.model";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { cache } from "react";

const getQuestionData = cache(async (questionId: string) => {
  await dbConnect();
  return Question.findById(questionId)
    .populate({
      path: "tags",
      model: "Tags",
      select: "name",
    })
    .populate({
      path: "author",
      model: "User",
      select: "name image",
    })
    .lean();
});

const getQuestion = async (
  questionId: string
): Promise<{
  success: boolean;
  data?: Iquestion;
  error?: string;
  details?: unknown;
}> => {
  try {
    const [question, auth_session] = await Promise.all([
      getQuestionData(questionId),
      auth(),
    ]);
    if (!question) throw new Error("Question not found");
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

    let collection = null;
    if (userId) {
      collection = await Collection.findOne({
        author: userId,
        question: questionId,
      });
    }

    return {
      success: true,
      data: { ...JSON.parse(JSON.stringify(question)), saved: !!collection },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
};
export default getQuestion;
