import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { api } from "./lib/api";
import { handleValidation } from "./lib/handleValidation";
import { signInWithCredentialsSchema } from "./lib/schemas/signInWithCredentailsSchema";

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
          const { data: existingAccount } =
            await api.accounts.getByProviderAccountId(email);
          if (!existingAccount) return null;

          const { data: existingUser } = await api.users.getById(
            existingAccount.userId.toString()
          );
          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password
          );
          if (isValidPassword) {
            const userId = (existingUser._id?.toString?.() ||
              existingUser.id) as string;
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

      const { success } = await api.auth.signInWithOauth({
        user: {
          email,
          name,
          image,
          username,
        },
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      return success;
    },
    async jwt({ token, account, user }) {
      if (account?.type === "credentials" && user?.id) {
        token.sub = user.id;
        return token;
      }

      if (account) {
        const { success, data: accountData } =
          await api.accounts.getByProviderAccountId(account?.providerAccountId);

        if (!success || !accountData) return token;

        const userId = accountData?.userId;

        if (userId) token.sub = userId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});
