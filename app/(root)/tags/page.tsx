import CommonFilter from "@/components/CommonFilter";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import TagInfoCard from "@/components/TagInfoCard";
import { TagFilters, DefaultFilters } from "@/constant/filters";
import { getTags } from "@/lib/actions/getTags.action";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
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
    pageSize = 10,
  } = await searchParams.searchParams;
  const { data, success, message } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    filter: filter || "",
  });
  const { tags = [], isNext = false } = data || {};

  return (
    <div className="flex flex-col gap-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            All Tags
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Browse topics and use the search bar to find tags fast.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CommonFilter
              filters={TagFilters}
              defaultFilter={DefaultFilters.TagFilters}
            />
          </div>
          <p className="text-sm text-gray-400 hidden sm:block whitespace-nowrap">
            {tags.length} tags
          </p>
        </div>
      </div>
      {/* Thread Card Section - Hardcoded */}
      <DataRenderer
        success={success}
        message={message}
        emptyTitle="No Tags Found"
        emptyDescription="No tags match your current search."
        errorDescription="We couldn’t load tags right now. Please try again."
        data={tags.map((q) => ({ ...q, _id: q._id.toString() }))}
        render={(tags) =>
          tags?.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag) => (
                <TagInfoCard
                  tagId={tag._id}
                  key={tag._id}
                  tag={{ name: tag.name }}
                  count={tag.questions}
                />
              ))}
            </div>
          ) : null
        }
      />
      <Pagination isNext={isNext} page={Number(page)} />
    </div>
  );
}
