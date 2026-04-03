"use server";

import { auth } from "@/auth";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { toggleBookMarkSchema } from "../schemas/toggleBookMarkSchema";
import Collection from "@/database/Collection.model";
import { actionErrorResponse } from "../response";

export async function toggleBookMarkAction(params: {
  questionId: string;
}): Promise<{
  success: boolean;
  data?: {
    saved: boolean;
  };
  message?: string;
  details?: object | null;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, toggleBookMarkSchema);
  const { questionId } = validatedData.data;
  const auth_session = await auth();
  const userId = auth_session?.user?.id;
  try {
    if (!userId) throw new Error("You must be logged in to save this question");

    const deletedCollection = await Collection.findOneAndDelete({
      author: userId,
      question: questionId,
    }).lean();

    if (deletedCollection) {
      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      author: userId,
      question: questionId,
    });
    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
