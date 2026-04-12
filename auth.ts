import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import mongoose from "mongoose";
import slugify from "slugify";

import { handleValidation } from "./lib/handleValidation";
import { signInWithCredentialsSchema } from "./lib/schemas/signInWithCredentailsSchema";
import dbConnect from "@/lib/dbConnect";
import Account from "@/database/Account.model";
import User from "@/database/User.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validationFields = handleValidation(
          credentials,
          signInWithCredentialsSchema
        );
        if (validationFields.success) {
          const { email, password } = validationFields.data;
          await dbConnect();
          const existingAccount = await Account.findOne({
            provider: "credentials",
            providerAccountId: email,
          })
            .select("userId password")
            .lean();
          if (!existingAccount) return null;

          const existingUser = await User.findById(existingAccount.userId)
            .select("name username email image")
            .lean();
          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            String(existingAccount.password || "")
          );
          if (isValidPassword) {
            const userId = String(existingUser._id);
            return {
              id: userId,
              name: existingUser.name,
              username: existingUser.username,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      await dbConnect();
      const session = await mongoose.startSession();
      session.startTransaction();

      const profileRecord =
        profile && typeof profile === "object"
          ? (profile as Record<string, unknown>)
          : {};
      const profileLogin = String(profileRecord.login || "").trim();
      const baseUsername = (
        account.provider === "github"
          ? profileLogin || user.name || user.email || account.providerAccountId
          : user.name || user.email || account.providerAccountId
      )
        .toLowerCase()
        .replace(/\s+/g, "-");
      const username = baseUsername.slice(0, 50);
      const baseName = String(user.name || username || "user")
        .replace(/https?:\/\/[^\s]+/g, "")
        .trim();
      const safeName = baseName.length < 3 ? `${baseName}__` : baseName;
      const name = safeName.slice(0, 60);
      const email =
        String(user.email || profileRecord.email || "").trim() ||
        `${account.providerAccountId}@${account.provider}.local`;
      const image =
        String(user.image || profileRecord.avatar_url || "").trim() ||
        "https://avatars.githubusercontent.com/u/0?v=4";

      try {
        const safeUsername =
          slugify(username, {
            lower: true,
            trim: true,
            strict: true,
          }) || `user-${String(account.providerAccountId).slice(0, 12)}`;

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
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        }).session(session);
        if (!existingAccount) {
          await Account.create(
            [
              {
                userId: existingUser._id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                name,
                image,
              },
            ],
            { session }
          );
        }
        await session.commitTransaction();
        return true;
      } catch {
        await session.abortTransaction();
        return false;
      } finally {
        await session.endSession();
      }
    },
    async jwt({ token, account, user }) {
      if (account?.type === "credentials" && user?.id) {
        token.sub = user.id;
        return token;
      }

      if (account) {
        await dbConnect();
        const existingAccount = await Account.findOne({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })
          .select("userId")
          .lean();
        if (existingAccount?.userId) {
          token.sub = String(existingAccount.userId);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});
