"use server";

import dbConnect from "../dbConnect";
import { actionErrorResponse } from "../response";
import { handleValidation } from "../handleValidation";
import Account from "@/database/Account.model";
import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { signInWithCredentialsSchema } from "../schemas/signInWithCredentailsSchema";
export async function signInWithCredentials(params: {
  email: string;
  password: string;
}) {
  await dbConnect();
  try {
    const validatedData = handleValidation(params, signInWithCredentialsSchema);
    const { email, password } = validatedData.data;

    const account = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!account) throw new Error("Account not found");
    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) throw new Error("Incorrect password");
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return actionErrorResponse(error);
  }
}
