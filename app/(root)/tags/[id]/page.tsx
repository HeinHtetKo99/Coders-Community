import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import ThreadCard from "@/components/ThreadCard";

import { getTagQuestions } from "@/lib/actions/getTagQuestions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tag",
};

export default async function Home(Params: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    tagId?: string;
    pageSize?: string;
  }>;
}) {
  const { id } = await Params.params;

  const { search, page = 1, pageSize = 10 } = await Params.searchParams;
  const { data, success, message } = await getTagQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    tagId: id || "",
  });
  const { questions = [], tags = [], isNext = false } = data || {};

  return (
    <div className="flex flex-col gap-6 py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          All Threads in {Array.isArray(tags) ? "" : tags?.name || ""}
        </h1>
      </div>
      {/* Thread Card Section - Hardcoded */}
      <DataRenderer
        success={success}
        message={message}
        data={questions.map((q) => ({ ...q, _id: q._id.toString() }))}
        render={(questions) =>
          questions?.map((question) => (
            <ThreadCard
              key={question._id}
              question={{ ...question, _id: question._id.toString() }}
            />
          ))
        }
      />
      <Pagination isNext={isNext} page={Number(page)} />
    </div>
  );
}
