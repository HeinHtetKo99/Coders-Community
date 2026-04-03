"use client";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import React, { useTransition } from "react";
interface Filter {
  name: string;
  value: string;
}
function CommonFilter({
  filters,
  defaultFilter,
}: {
  filters: Filter[];
  defaultFilter?: string;
}) {
  const [isPending, transitionStart] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || defaultFilter || "";
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const currentQuery = queryString.parse(window.location.search);

    const updatedQuery = {
      ...currentQuery,
      filter: selectedValue || "",
    };

    const url = queryString.stringifyUrl(
      {
        url: window.location.pathname,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );
    transitionStart(() => {
      router.push(url);
    });
  };
  return (
    <div className="relative min-w-42.5 w-full sm:w-auto">
      <select
        value={currentFilter}
        onChange={handleFilter}
        className="w-full appearance-none px-4 py-2.5 rounded-lg border border-white/5 bg-primary/40 text-gray-300 text-sm outline-none hover:bg-primary/60 hover:text-white transition-all cursor-pointer shadow-sm focus:border-main/50"
      >
        {filters.map((filter) => (
          <option
            key={filter.value}
            value={filter.value}
            className="bg-secondary text-gray-300 py-2"
          >
            {filter.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg
          className="w-4 h-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
      {isPending && (
        <div className="pointer-events-none absolute inset-y-0 right-9 flex items-center">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/15 border-t-main animate-spin" />
        </div>
      )}
    </div>
  );
}

export default CommonFilter;
