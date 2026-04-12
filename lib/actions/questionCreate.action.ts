"use server";

import Question from "@/database/Question.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { questionCreateSchema } from "../schemas/questionCreateSchema";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { actionErrorResponse } from "../response";
import Tags from "@/database/Tag.model";
import TagQuestions from "@/database/Tag-Question.model";
import User from "@/database/User.model";
import { revalidatePath } from "next/cache";
import Routes from "@/routes";
import { reputationRules } from "../reputation/config";

const applyReputationDelta = async (userId: string, delta: number) => {
  const user = await User.findById(userId).select("reputation").lean();
  if (!user) return;

  await User.findByIdAndUpdate(userId, {
    reputation: Math.max(0, Number(user.reputation || 0) + delta),
  });
};

export async function questionCreate(params: {
  title: string;
  content: string;
  tags: string[];
}): Promise<{
  success: boolean;
  data?: {
    _id: string;
    title: string;
    content: string;
    author: string;
    tags: string[];
  };
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = handleValidation(params, questionCreateSchema);
    const { title, content, tags } = validatedData.data;
    const session_auth = await auth();
    const sessionUserId = session_auth?.user?.id;
    const sessionUserEmail = session_auth?.user?.email;

    let userId: mongoose.Types.ObjectId | string | undefined;

    if (sessionUserId && mongoose.Types.ObjectId.isValid(sessionUserId)) {
      userId = sessionUserId;
    } else if (sessionUserEmail) {
      const existingUser = await User.findOne({
        email: sessionUserEmail,
      }).select("_id");
      userId = existingUser?._id;
    }

    if (!userId) throw new Error("Please sign in again");

    const normalizedTags = Array.from(
      new Set(
        tags.map((tag: string) => tag.trim().toLowerCase()).filter(Boolean)
      )
    );

    const [question] = await Question.create(
      [
        {
          title,
          content,
          author: userId,
        },
      ],
      { session }
    );
    if (!question) throw new Error("Question creation failed");
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of normalizedTags) {
      const existingTag = await Tags.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestions.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();
    const questionId = String(question._id);
    const profileUserId = String(userId);
    await applyReputationDelta(profileUserId, reputationRules.question.create);
    revalidatePath(Routes.Home);
    revalidatePath(Routes.questions);
    revalidatePath(Routes.tags);
    revalidatePath(Routes.question_details(questionId));
    revalidatePath(Routes.userProfile(profileUserId));
    for (const tagId of tagIds) {
      revalidatePath(`/tags/${String(tagId)}`);
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (e) {
    await session.abortTransaction();
    return actionErrorResponse(e);
  } finally {
    await session.endSession();
  }
}
