"use server";

import dbConnect from "../dbConnect";
import mongoose from "mongoose";
import { actionErrorResponse } from "../response";
import { handleValidation } from "../handleValidation";
import { signUpWithCredentialsSchema } from "../schemas/signUpWithCredentialsSchema";
import User from "@/database/User.model";
import Account from "@/database/Account.model";
import { signIn } from "@/auth";
import bcrypt from "bcryptjs";

export async function signUpWithCredentials(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = handleValidation(params, signUpWithCredentialsSchema);
    const { name, username, email, password } = validatedData.data;

    const existingEmail = await User.findOne({ email }).session(session);
    if (existingEmail) throw new Error("Email already exists");
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) throw new Error("Username already exists");

    const [newUser] = await User.create(
      [
        {
          name,
          username,
          email,
        },
      ],
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: await bcrypt.hash(password, 12),
        },
      ],
      { session }
    );
    await session.commitTransaction();
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return actionErrorResponse(error);
  } finally {
    await session.endSession();
  }
}
