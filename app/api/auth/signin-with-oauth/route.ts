import Account from "@/database/Account.model";
import User from "@/database/User.model";
import dbConnect from "@/lib/dbConnect";
import { handleValidation } from "@/lib/handleValidation";
import { handleErrorRespone, handleSuccessRespone } from "@/lib/response";
import signInWithOauthSchema from "@/lib/schemas/signInWithOauthSchema";
import mongoose from "mongoose";
import slugify from "slugify";

export async function POST(req: Request) {
  const { provider, providerAccountId, user } = await req.json();
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = handleValidation(
      {
        provider,
        providerAccountId,
        user,
      },
      signInWithOauthSchema
    );
    const { email, name, image, username } = validatedData.data.user;
    const safeUsername =
      slugify(username, {
        lower: true,
        trim: true,
        strict: true,
      }) || `user-${providerAccountId.slice(0, 12)}`;
    let existingUser = await User.findOne({
      email,
    }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            email,
            name,
            image,
            username: safeUsername,
          },
        ],
        { session }
      );
    } else {
      await User.updateOne(
        {
          _id: existingUser._id,
        },
        {
          $set: {
            name,
            image,
          },
        }
      ).session(session);
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);
    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            provider,
            providerAccountId,
            name,
            image,
          },
        ],
        { session }
      );
    }
    await session.commitTransaction();
    return handleSuccessRespone(existingUser);
  } catch (e) {
    session.abortTransaction();
    return handleErrorRespone(e);
  } finally {
    session.endSession();
  }
}
