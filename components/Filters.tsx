"use client";
import React from "react";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { getTagIcon } from "@/components/tagIcons";

function Filters({ tags = [] }: { tags?: { name: string }[] }) {
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter") || "";
  const { replace } = useRouter();
  const visibleTags = tags.slice(0, 8);

  const handleFilter = (filterType: string) => {
    const currentParams = qs.parse(window.location.search);
    const nextFilter = filterType === activeFilter ? "" : filterType;
    const newParams = { ...currentParams } as Record<string, unknown>;

    if (nextFilter) {
      newParams.filter = nextFilter;
      newParams.page = "1";
    } else {
      delete newParams.filter;
      delete newParams.page;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: newParams as Record<string, string | number | boolean>,
      },
      { skipNull: true, skipEmptyString: true }
    );

    replace(url);
  };

  if (!visibleTags.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-3">
      {visibleTags.map((tag) => {
        const tagValue = tag.name.toLowerCase();
        const tagIcon = getTagIcon(tag.name);
        const Icon = tagIcon.icon;
        const isActive = activeFilter.toLowerCase() === tagValue;

        return (
          <button
            key={tag.name}
            onClick={() => handleFilter(tagValue)}
            className={`group flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold border ${
              isActive
                ? "bg-main/90 text-white border-main shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                : "bg-primary/70 text-gray-300 border-white/5 hover:border-white/15 hover:text-white hover:bg-primary"
            }`}
          >
            <span
              className={`flex size-7 items-center justify-center rounded-lg ring-1 transition-all ${
                isActive ? "bg-white/15 ring-white/25" : tagIcon.badgeClassName
              }`}
            >
              <Icon
                className={`text-sm transition-colors ${
                  isActive ? "text-white" : tagIcon.iconClassName
                }`}
              />
            </span>
            <span>{tag.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Filters;
