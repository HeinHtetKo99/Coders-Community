import Link from "next/link";
import React from "react";
import { BsCodeSlash, BsQuestionCircleFill } from "react-icons/bs";
import { getTechNewsAction } from "@/lib/actions/getTechNews.action";
import { getQuestions } from "@/lib/actions/getQuestions.action";
import { getTags } from "@/lib/actions/getTags.action";
import { cache } from "react";
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

const getRightSidebarData = cache(async () => {
  const [techNewsResult, questionsResult, tagsResult] = await Promise.all([
    getTechNewsAction(),
    getQuestions({ page: 1, pageSize: 5, filter: "popular" }),
    getTags({ page: 1, pageSize: 5, filter: "popular" }),
  ]);

  return {
    techNews: Array.isArray(techNewsResult.data)
      ? techNewsResult.data.slice(0, 6)
      : [],
    popularQuestions: questionsResult.data?.questions ?? [],
    currentTags: tagsResult.data?.tags ?? [],
  };
});

async function RightSidebar() {
  const { techNews, popularQuestions, currentTags } =
    await getRightSidebarData();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Popular Questions
        </h3>
        <div className="flex flex-col gap-5">
          {popularQuestions.map((question) => (
            <Link
              key={String(question._id)}
              href={`/questions/${String(question._id)}`}
              className="group flex items-start gap-3 transition-all"
            >
              <BsQuestionCircleFill className="mt-1 h-4 w-4 shrink-0 text-main opacity-80 group-hover:opacity-100" />
              <p className="text-[13px] leading-relaxed font-medium text-gray-400 transition-colors group-hover:text-white line-clamp-2">
                {question.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Tags</h3>
        <div className="flex flex-col gap-3">
          {currentTags.map((tag) => {
            const tagIcon = getTagIcon(tag.name);
            const Icon = tagIcon.icon;

            return (
              <Link
                key={String(tag._id)}
                href={`/tags/${String(tag._id)}`}
                className="group flex items-center justify-between p-3 rounded-xl bg-primary/20 border border-white/5 transition-all hover:bg-primary/40 hover:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg ring-1 ${tagIcon.badgeClassName}`}
                  >
                    <Icon className={`text-base ${tagIcon.iconClassName}`} />
                  </span>
                  <span className="text-[13px] font-semibold text-gray-300 group-hover:text-white">
                    {tag.name}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-300">
                  {tag.questions}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Tech News
        </h3>
        <div className="flex flex-col gap-4">
          {techNews.map((article) => (
            <Link
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] leading-relaxed font-medium text-gray-400 transition-colors hover:text-white line-clamp-2"
            >
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
