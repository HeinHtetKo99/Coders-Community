import z from "zod";

const signInWithOauthSchema = z.object({
  provider: z.enum(["github", "google"]),
  providerAccountId: z.string().min(1),
  user: z.object({
    name: z.string().min(3).max(60),
    username: z.string().min(3).max(50),
    email: z.string().email(),
    image: z.string().url().optional(),
  }),
});

export default signInWithOauthSchema;
