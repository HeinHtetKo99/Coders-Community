"use client";
import React from "react";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { BsCodeSlash } from "react-icons/bs";
import {
  FaBootstrap,
  FaCss3Alt,
  FaDatabase,
  FaHtml5,
  FaJava,
  FaJs,
  FaLaravel,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaReact,
  FaVuejs,
} from "react-icons/fa";
import { SiMongodb, SiNextdotjs, SiTypescript } from "react-icons/si";
import { IconType } from "react-icons";

type TagIconConfig = {
  icon: IconType;
  iconClassName: string;
  badgeClassName: string;
};

const DEFAULT_TAG_ICON: TagIconConfig = {
  icon: BsCodeSlash,
  iconClassName: "text-gray-300",
  badgeClassName: "bg-white/5 ring-white/10",
};

const TAG_ICON_MAP: Record<string, TagIconConfig> = {
  react: {
    icon: FaReact,
    iconClassName: "text-sky-400",
    badgeClassName: "bg-sky-500/15 ring-sky-400/30",
  },
  vue: {
    icon: FaVuejs,
    iconClassName: "text-emerald-500",
    badgeClassName: "bg-emerald-500/15 ring-emerald-400/30",
  },
  vuejs: {
    icon: FaVuejs,
    iconClassName: "text-emerald-500",
    badgeClassName: "bg-emerald-500/15 ring-emerald-400/30",
  },
  laravel: {
    icon: FaLaravel,
    iconClassName: "text-red-500",
    badgeClassName: "bg-red-500/15 ring-red-400/30",
  },
  python: {
    icon: FaPython,
    iconClassName: "text-blue-400",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  "node.js": {
    icon: FaNodeJs,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  nodejs: {
    icon: FaNodeJs,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  next: {
    icon: SiNextdotjs,
    iconClassName: "text-gray-100",
    badgeClassName: "bg-white/10 ring-white/20",
  },
  "next.js": {
    icon: SiNextdotjs,
    iconClassName: "text-gray-100",
    badgeClassName: "bg-white/10 ring-white/20",
  },
  javascript: {
    icon: FaJs,
    iconClassName: "text-yellow-400",
    badgeClassName: "bg-yellow-500/15 ring-yellow-400/30",
  },
  typescript: {
    icon: SiTypescript,
    iconClassName: "text-blue-400",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  html: {
    icon: FaHtml5,
    iconClassName: "text-orange-500",
    badgeClassName: "bg-orange-500/15 ring-orange-400/30",
  },
  css: {
    icon: FaCss3Alt,
    iconClassName: "text-blue-500",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  php: {
    icon: FaPhp,
    iconClassName: "text-indigo-400",
    badgeClassName: "bg-indigo-500/15 ring-indigo-400/30",
  },
  mongodb: {
    icon: SiMongodb,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  database: {
    icon: FaDatabase,
    iconClassName: "text-purple-300",
    badgeClassName: "bg-purple-500/15 ring-purple-400/30",
  },
  java: {
    icon: FaJava,
    iconClassName: "text-orange-400",
    badgeClassName: "bg-orange-500/15 ring-orange-400/30",
  },
  bootstrap: {
    icon: FaBootstrap,
    iconClassName: "text-violet-400",
    badgeClassName: "bg-violet-500/15 ring-violet-400/30",
  },
};

function getTagIcon(tagName: string): TagIconConfig {
  const normalizedName = tagName.trim().toLowerCase();
  return TAG_ICON_MAP[normalizedName] ?? DEFAULT_TAG_ICON;
}

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
