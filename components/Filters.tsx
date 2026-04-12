import React from "react";
import Link from "next/link";
import { getTagIcon } from "@/components/tagIcons";

function Filters({
  tags = [],
  activeFilter = "",
  search = "",
  pageSize,
}: {
  tags?: { name: string }[];
  activeFilter?: string;
  search?: string;
  pageSize?: number;
}) {
  const visibleTags = tags.slice(0, 8);

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
        const params = new URLSearchParams();
        const nextFilter = isActive ? "" : tagValue;
        if (search) params.set("search", search);
        if (pageSize) params.set("pageSize", String(pageSize));
        if (nextFilter) {
          params.set("filter", nextFilter);
          params.set("page", "1");
        }
        const href = params.size ? `/?${params.toString()}` : "/";

        return (
          <Link
            key={tag.name}
            href={href}
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
          </Link>
        );
      })}
    </div>
  );
}

export default Filters;
