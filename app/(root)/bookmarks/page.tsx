import CommonFilter from "@/components/CommonFilter";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import ThreadCard from "@/components/ThreadCard";
import { CollectionFilters, DefaultFilters } from "@/constant/filters";
import getBookMarkCollections from "@/lib/actions/getBookMarkCollections.action";
import { getTags } from "@/lib/actions/getTags.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Routes from "@/routes";
import type { Metadata } from "next";

import { BsBookmarkFill } from "react-icons/bs";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    filter?: string;
    page?: number;
    pageSize?: number;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect(Routes.Login);
  }

  const {
    search,
    filter,
    page = 1,
    pageSize = 10,
  } = (await searchParams) || {};
  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 10;
  const [{ data, success, message }, { data: tagsData }] = await Promise.all([
    getBookMarkCollections({
      page: parsedPage,
      pageSize: parsedPageSize,
      search: search || "",
      filter: filter || "",
    }),
    getTags({
      page: 1,
      pageSize: 8,
      filter: "popular",
    }),
  ]);
  const { collections = [], isNext = false } = data || {};
  const { tags = [] } = tagsData || {};

  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-200 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-main/10 border border-main/20">
              <BsBookmarkFill className="w-6 h-6 text-main" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Saved Threads
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-lg mt-1">
            All your bookmarked questions and discussions in one place. Easily
            find and reference the threads you&apos;ve saved for later.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="w-full sm:w-auto">
          <CommonFilter
            filters={CollectionFilters}
            defaultFilter={DefaultFilters.CollectionFilters}
          />
        </div>
      </div>

      {/* Thread Card Section */}
      <div className="px-2">
        <DataRenderer
          success={success}
          message={message}
          data={collections}
          render={(collections) =>
            collections?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {collections.map((collection: any, i: number) => (
                  <ThreadCard key={i} question={collection.question} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-white/5 rounded-2xl bg-primary/20">
                <BsBookmarkFill className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No saved threads yet
                </h3>
                <p className="text-gray-400 max-w-md">
                  When you find a question you want to reference later, click
                  the save button and it will appear here.
                </p>
              </div>
            )
          }
        />
      </div>
      <Pagination isNext={isNext} page={parsedPage} />
    </div>
  );
}
