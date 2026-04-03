import type { Metadata } from "next";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import ThreadCard from "@/components/ThreadCard";
import { getQuestions } from "@/lib/actions/getQuestions.action";

export const metadata: Metadata = {
  title: "Popular Questions",
};

export default async function QuestionsPage(searchParams: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const {
    search,
    page = "1",
    pageSize = "3",
  } = await searchParams.searchParams;
  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 3;

  const [{ data, success, message }] = await Promise.all([
    getQuestions({
      page: parsedPage,
      pageSize: parsedPageSize,
      search: search || "",
      filter: "popular",
    }),
  ]);

  const { questions = [], isNext = false } = data || {};

  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-200 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Popular Questions
        </h1>
      </div>

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

      <Pagination isNext={isNext} page={parsedPage} />
    </div>
  );
}
