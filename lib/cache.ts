import { revalidateTag } from "next/cache";

export const cacheTags = {
  users: "users",
} as const;

export function revalidateCacheTags(tags: string[]) {
  tags.forEach((tag) => revalidateTag(tag, "default"));
}
