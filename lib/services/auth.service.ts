import Account from "@/database/Account.model";
import User from "@/database/User.model";
import dbConnect from "@/lib/dbConnect";
import { handleValidation } from "@/lib/handleValidation";
import signInWithOauthSchema from "@/lib/schemas/signInWithOauthSchema";
import mongoose from "mongoose";
import slugify from "slugify";

export async function getCredentialsAccountByEmail(email: string) {
  await dbConnect();
  return Account.findOne({
    provider: "credentials",
    providerAccountId: email,
  })
    .select("+password")
    .lean();
}

export async function getAccountByProvider(
  provider: string,
  providerAccountId: string
) {
  await dbConnect();
  return Account.findOne({ provider, providerAccountId }).lean();
}

export async function getUserById(id: string) {
  await dbConnect();
  return User.findById(id).lean();
}

export async function signInWithOauth(params: {
  provider: string;
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}): Promise<{ success: boolean }> {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = handleValidation(params, signInWithOauthSchema);
    const { provider, providerAccountId } = validatedData.data;
    const { email, name, image, username } = validatedData.data.user;
    const safeUsername =
      slugify(username, {
        lower: true,
        trim: true,
        strict: true,
      }) || `user-${providerAccountId.slice(0, 12)}`;

    let existingUser = await User.findOne({ email }).session(session);
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
        { _id: existingUser._id },
        { $set: { name, image } }
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
    return { success: true };
  } catch {
    await session.abortTransaction();
    return { success: false };
  } finally {
    await session.endSession();
  }
}
