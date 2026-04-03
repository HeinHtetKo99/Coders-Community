"use server";

import { auth } from "@/auth";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { deleteQuestionSchema } from "../schemas/deleteQuestionSchema";
import mongoose from "mongoose";
import { actionErrorResponse } from "../response";
import Question from "@/database/Question.model";
import Collection from "@/database/Collection.model";
import TagQuestions from "@/database/Tag-Question.model";
import Tags from "@/database/Tag.model";
import Vote from "@/database/Vote.model";
import Answer from "@/database/Answer.model";
import { revalidatePath } from "next/cache";
import Routes from "@/routes";
import User from "@/database/User.model";
import { reputationRules } from "../reputation/config";

const applyReputationDeltas = async (deltasByUserId: Map<string, number>) => {
  const userIds = Array.from(deltasByUserId.keys());
  if (!userIds.length) return;

  const users = await User.find({ _id: { $in: userIds } })
    .select("_id reputation")
    .lean();

  await Promise.all(
    users.map((user) => {
      const delta = deltasByUserId.get(String(user._id)) ?? 0;
      return User.findByIdAndUpdate(user._id, {
        reputation: Math.max(0, Number(user.reputation || 0) + delta),
      });
    })
  );
};

export async function deleteQuestionAction(params: {
  questionId: string;
}): Promise<{ success: boolean; message?: string }> {
  await dbConnect();
  const validatedData = handleValidation(params, deleteQuestionSchema);
  const { questionId } = validatedData.data;
  const auth_session = await auth();
  const user = auth_session?.user;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      throw new Error("Question not found");
    }
    if (question.author.toString() !== user?.id) {
      throw new Error("Not authorized");
    }
    const questionTagIds = question.tags.map((tagId: mongoose.Types.ObjectId) =>
      String(tagId)
    );
    await Collection.deleteMany({ question: questionId }).session(session);
    await TagQuestions.deleteMany({ question: questionId }).session(session);

    if (questionTagIds.length > 0) {
      await Tags.updateMany(
        {
          _id: { $in: questionTagIds },
        },
        {
          $inc: { questions: -1 },
        },
        { session }
      );
      await Tags.deleteMany({
        _id: { $in: questionTagIds },
        questions: { $lte: 0 },
      }).session(session);
    }

    await Vote.deleteMany({
      type_id: questionId,
      type: "question",
    }).session(session);

    const answers = await Answer.find({ question: questionId }).session(
      session
    );
    const deltasByUserId = new Map<string, number>();
    const questionContribution =
      reputationRules.question.create +
      Number(question.upvotes || 0) * reputationRules.question.upvote +
      Number(question.downvotes || 0) * reputationRules.question.downvote;
    const questionAuthorId = String(question.author);
    deltasByUserId.set(questionAuthorId, -questionContribution);

    answers.forEach((answer) => {
      const answerContribution =
        reputationRules.answer.create +
        Number(answer.upvotes || 0) * reputationRules.answer.upvote +
        Number(answer.downvotes || 0) * reputationRules.answer.downvote;
      const answerAuthorId = String(answer.author);
      deltasByUserId.set(
        answerAuthorId,
        (deltasByUserId.get(answerAuthorId) ?? 0) - answerContribution
      );
    });

    await Answer.deleteMany({ question: questionId }).session(session);
    await Vote.deleteMany({
      type_id: { $in: answers.map((answer) => answer._id) },
      type: "answer",
    }).session(session);
    await Question.findByIdAndDelete(questionId).session(session);

    await session.commitTransaction();
    await applyReputationDeltas(deltasByUserId);
    revalidatePath(Routes.Home);
    revalidatePath(Routes.questions);
    revalidatePath(Routes.tags);
    revalidatePath(Routes.userProfile(user?.id as string));
    for (const tagId of questionTagIds) {
      revalidatePath(`/tags/${tagId}`);
    }
    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    return actionErrorResponse(e);
  } finally {
    await session.endSession();
  }
}
