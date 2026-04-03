import DataRenderer from "@/components/DataRenderer";
import { getUsers } from "@/lib/actions/getUsers.action";
import UserInfoCard from "./components/UserInfoCard";
import CommonFilter from "@/components/CommonFilter";
import { UserFilters, DefaultFilters } from "@/constant/filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
};

export default async function Home(searchParams: {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const { search, filter, page, pageSize } = await searchParams.searchParams;
  const { data, success, message } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: search || "",
    filter: filter || "",
  });
  if (!success) {
    throw new Error(message || "Failed to fetch users");
  }
  const { users = [] } = data || {};

  return (
    <div className="flex flex-col gap-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            All Users
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Browse users and use the search bar to find users fast.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CommonFilter
              filters={UserFilters}
              defaultFilter={DefaultFilters.UserFilters}
            />
          </div>
          <p className="text-sm text-gray-400 hidden sm:block whitespace-nowrap">
            {users.length} users
          </p>
        </div>
      </div>
      {/* Thread Card Section - Hardcoded */}
      <DataRenderer
        success={success}
        message={message}
        emptyTitle="No Users Found"
        emptyDescription="No users match your current search."
        errorDescription="We couldn’t load users right now. Please try again."
        data={users.map((q) => ({ ...q, _id: (q as any)._id?.toString() }))}
        render={(users) =>
          users?.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <UserInfoCard
                  key={user?._id}
                  name={user?.name}
                  image={user?.image}
                  id={user?._id}
                  reputation={Number(
                    (user as { reputation?: number })?.reputation || 0
                  )}
                />
              ))}
            </div>
          ) : null
        }
      />
    </div>
  );
}
