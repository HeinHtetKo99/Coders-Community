"use server";

import { actionErrorResponse } from "../response";

export type TechNewsArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  readable_publish_date: string;
  public_reactions_count: number;
  comments_count: number;
  cover_image: string | null;
  user?: {
    name?: string;
    profile_image?: string;
  };
};

const shuffle = <T>(items: T[]) => {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
};

export async function getTechNewsAction(): Promise<{
  success: boolean;
  data?: TechNewsArticle[];
  message?: string;
  details?: unknown;
}> {
  try {
    const response = await fetch("https://dev.to/api/articles?per_page=12", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["tech-news"] },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tech news");
    }
    const data = (await response.json()) as TechNewsArticle[];
    return {
      success: true,
      data: shuffle(data),
    };
  } catch (e) {
    return actionErrorResponse(e);
  }
}
