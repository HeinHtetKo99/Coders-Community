export const dynamic = "force-static";
export const revalidate = 300;
import type { Metadata } from "next";
import TechNewsClient from "./components/TechNewsClient";
import { getTechNewsAction } from "@/lib/actions/getTechNews.action";

export const metadata: Metadata = {
  title: "Tech News",
};

export default async function TechNewsPage() {
  const { success, message, data } = await getTechNewsAction();
  const articles = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2 px-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Tech News
        </h1>
        <p className="text-sm text-gray-400">
          Fresh articles from DEV Community, refreshed automatically.
        </p>
      </div>
      <TechNewsClient
        articles={articles}
        success={success}
        message={message || ""}
      />
    </div>
  );
}
