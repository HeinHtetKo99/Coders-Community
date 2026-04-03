"use server";

import User, { Iuser } from "@/database/User.model";
import dbConnect from "../dbConnect";
import { handleValidation } from "../handleValidation";
import { actionErrorResponse } from "../response";
import { getUserSchema } from "../schemas/getUserSchema";
import Question from "@/database/Question.model";
import Answer from "@/database/Answer.model";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import Routes from "@/routes";

export async function getUser(params: { userId: string }): Promise<{
  success: boolean;
  data?: {
    user: Iuser;
    totalAnswers: number;
    totalQuestions: number;
  };
  error?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getUserSchema);
  const { userId } = validatedData.data;

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return actionErrorResponse("User not found");
    }

    const [totalAnswers, totalQuestions] = await Promise.all([
      Answer.countDocuments({ author: userId }).lean(),
      Question.countDocuments({ author: userId }).lean(),
    ]);

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalAnswers,
        totalQuestions,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}

const updateUserImageSchema = z.object({
  image: z.string().max(1_500_000).optional(),
});

export async function updateUserImage(params: { image?: string }): Promise<{
  success: boolean;
  data?: { image?: string };
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, updateUserImageSchema);
  const { image } = validatedData.data;

  try {
    const auth_session = await auth();
    const userId = String(auth_session?.user?.id || "");
    if (!userId) throw new Error("You must be logged in");

    const trimmed = String(image || "").trim();

    if (trimmed) {
      const isDataUrl = trimmed.startsWith("data:image/");
      const isHttpUrl = /^https?:\/\//i.test(trimmed);

      if (!isDataUrl && !isHttpUrl) {
        throw new Error("Invalid image format");
      }
      if (isDataUrl) {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        const mimeMatch = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/.exec(
          trimmed
        );
        const mime = mimeMatch?.[1] || "";
        if (!allowed.includes(mime)) {
          throw new Error("Only JPG, PNG or WEBP images are supported");
        }
      }
    }

    const updateQuery = trimmed
      ? { $set: { image: trimmed } }
      : { $unset: { image: 1 } };

    const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
      select: "image",
      lean: true,
    });
    if (!updatedUser) throw new Error("User not found");

    revalidatePath(Routes.userProfile(userId));

    return {
      success: true,
      data: {
        image: updatedUser.image,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}

const getUserNavSchema = z.object({
  userId: z.string().min(1),
});

export async function getUserNavData(params: { userId: string }): Promise<{
  success: boolean;
  data?: { name?: string; username?: string; image?: string };
  message?: string;
  details?: unknown;
}> {
  await dbConnect();
  const validatedData = handleValidation(params, getUserNavSchema);
  const { userId } = validatedData.data;

  try {
    const user = await User.findById(userId)
      .select("name username image")
      .lean();
    if (!user) return actionErrorResponse("User not found");

    return {
      success: true,
      data: {
        name: user.name,
        username: user.username,
        image: user.image,
      },
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
