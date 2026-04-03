import { z, ZodError } from "zod";

export const handleValidation = <T extends z.ZodTypeAny>(
  body: unknown,
  schema: T,
  partial: boolean = false
) => {
  const finalSchema =
    partial && schema instanceof z.ZodObject ? schema.partial() : schema;

  const result = finalSchema.safeParse(body);

  if (!result.success) throw new ZodError(result.error.issues);

  return result; // ✅ typed output (not unknown)
};
