import CommonFilter from "@/components/CommonFilter";
import CreateThreadButton from "@/components/CreateThreadButton";
import DataRenderer from "@/components/DataRenderer";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import ThreadCard from "@/components/ThreadCard";
import { DefaultFilters, HomePageFilters } from "@/constant/filters";
import { getQuestions } from "@/lib/actions/getQuestions.action";
import { getTags } from "@/lib/actions/getTags.action";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home(searchParams: {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const {
    search,
    filter,
    page = 1,
    pageSize = 3,
  } = await searchParams.searchParams;
  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 3;

  const [session, { data, success, message }, { data: tagsData }] =
    await Promise.all([
      auth(),
      getQuestions({
        page: parsedPage,
        pageSize: parsedPageSize,
        search: search || "",
        filter: filter || DefaultFilters.HomePageFilters,
      }),
      getTags({
        page: 1,
        pageSize: 8,
        filter: "popular",
      }),
    ]);
  const { questions = [], isNext = false } = data || {};
  const { tags = [] } = tagsData || {};
  const isAuthenticated = !!session?.user?.id;

  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-200 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          All Threads
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <CommonFilter
            filters={HomePageFilters}
            defaultFilter={DefaultFilters.HomePageFilters}
          />
          <CreateThreadButton isAuthenticated={isAuthenticated} />
        </div>
      </div>
      {/* Filters Section */}
      <Filters tags={tags.map((tag) => ({ name: tag.name }))} />
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
      <Pagination isNext={isNext} page={parsedPage} />
    </div>
  );
}
