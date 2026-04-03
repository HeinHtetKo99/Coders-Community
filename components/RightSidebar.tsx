import Link from "next/link";
import React from "react";
import { BsQuestionCircleFill } from "react-icons/bs";
import { getTechNewsAction } from "@/lib/actions/getTechNews.action";
import { getQuestions } from "@/lib/actions/getQuestions.action";
import { getTags } from "@/lib/actions/getTags.action";
import { cache } from "react";
import { getTagIcon } from "@/components/tagIcons";

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
