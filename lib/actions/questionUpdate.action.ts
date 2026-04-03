"use server";

import mongoose from "mongoose";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import Question from "@/database/Question.model";
import { questionUpdateSchema } from "../schemas/questionUpdateSchema";
import Tags, { ItagsDoc } from "@/database/Tag.model";
import TagQuestions from "@/database/Tag-Question.model";
import { actionErrorResponse } from "../response";
import { revalidatePath } from "next/cache";
import Routes from "@/routes";

export async function questionUpdate(params: {
  questionId: string;
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
    const validatedData = handleValidation(params, questionUpdateSchema);
    const { title, content, tags, questionId } = validatedData.data;
    const normalizedTags = Array.from(
      new Set(
        tags.map((tag: string) => tag.trim().toLowerCase()).filter(Boolean)
      )
    );
    const question = await Question.findById(questionId)
      .populate("tags")
      .session(session);
    if (!question) {
      throw new Error("Failed to get a question");
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const currentTags = question.tags as ItagsDoc[];
    const currentTagNames = new Set(
      currentTags.map((tag) => tag.name.toLowerCase())
    );
    const tagsToAdd = normalizedTags.filter(
      (tag) => !currentTagNames.has(tag as string)
    );
    const tagsToRemove = currentTags.filter(
      (tag: ItagsDoc) => !normalizedTags.includes(tag.name.toLowerCase())
    );
    const removedTagIds: string[] = [];
    const addedTagIds: string[] = [];

    if (tagsToRemove.length) {
      const tagIdsToRemove = tagsToRemove.map((tag: ItagsDoc) => tag._id);
      removedTagIds.push(...tagIdsToRemove.map((id) => String(id)));

      await Tags.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );
      await Tags.deleteMany({
        _id: { $in: tagIdsToRemove },
        questions: { $lte: 0 },
      }).session(session);

      await TagQuestions.deleteMany({
        tag: { $in: tagIdsToRemove },
        question: questionId,
      }).session(session);

      question.tags = (question.tags as ItagsDoc[]).filter(
        (tag) =>
          !tagIdsToRemove.some((tagId) => String(tagId) === String(tag._id))
      ) as unknown as mongoose.Types.ObjectId[];
    }

    if (tagsToAdd.length) {
      const newTagDocuments: {
        tag: mongoose.Types.ObjectId;
        question: string;
      }[] = [];
      for (const tag of tagsToAdd) {
        const existingTag = await Tags.findOneAndUpdate(
          {
            name: { $regex: new RegExp(`^${tag}$`, "i") },
          },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );
        if (existingTag) {
          addedTagIds.push(String(existingTag._id));
          const existingTagQuestion = await TagQuestions.findOne({
            tag: existingTag._id,
            question: questionId,
          }).session(session);
          if (!existingTagQuestion) {
            newTagDocuments.push({
              tag: existingTag._id,
              question: questionId,
            });
          }
          if (
            !(question.tags as mongoose.Types.ObjectId[]).some(
              (tagId) => String(tagId) === String(existingTag._id)
            )
          ) {
            (question.tags as mongoose.Types.ObjectId[]).push(existingTag._id);
          }
        }
      }
      if (newTagDocuments.length) {
        await TagQuestions.insertMany(newTagDocuments, { session });
      }
    }
    await question.save({ session });
    await session.commitTransaction();
    revalidatePath(Routes.Home);
    revalidatePath(Routes.questions);
    revalidatePath(Routes.tags);
    revalidatePath(Routes.question_details(questionId));
    const revalidateTagIds = Array.from(
      new Set([...removedTagIds, ...addedTagIds])
    );
    for (const tagId of revalidateTagIds) {
      revalidatePath(`/tags/${tagId}`);
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return actionErrorResponse(error);
  } finally {
    await session.endSession();
  }
}
