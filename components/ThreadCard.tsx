import { AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import Logo from "../public/profile.jpg";
import Image from "next/image";
import Tags from "./Tags";
import { Iquestion } from "@/database/Question.model";
import Link from "next/link";
import Routes from "@/routes";
import Action from "@/app/(root)/questions/components/Action";

function formatRelativeTime(value: unknown) {
  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null;

  if (!date || Number.isNaN(date.getTime())) return "";

  const diffMs = date.getTime() - Date.now();
  const diffSeconds = diffMs / 1000;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const absSeconds = Math.abs(diffSeconds);
  if (absSeconds < 60) return rtf.format(Math.round(diffSeconds), "second");

  const diffMinutes = diffSeconds / 60;
  const absMinutes = Math.abs(diffMinutes);
  if (absMinutes < 60) return rtf.format(Math.round(diffMinutes), "minute");

  const diffHours = diffMinutes / 60;
  const absHours = Math.abs(diffHours);
  if (absHours < 24) return rtf.format(Math.round(diffHours), "hour");

  const diffDays = diffHours / 24;
  const absDays = Math.abs(diffDays);
  if (absDays < 7) return rtf.format(Math.round(diffDays), "day");

  const diffWeeks = diffDays / 7;
  const absWeeks = Math.abs(diffWeeks);
  if (absWeeks < 4) return rtf.format(Math.round(diffWeeks), "week");

  const diffMonths = diffDays / 30;
  const absMonths = Math.abs(diffMonths);
  if (absMonths < 12) return rtf.format(Math.round(diffMonths), "month");

  const diffYears = diffDays / 365;
  return rtf.format(Math.round(diffYears), "year");
}

function ThreadCard({
  question,
  currentUserId = "",
}: {
  question: Iquestion;
  currentUserId?: string;
}) {
  const questionAuthorId =
    typeof question?.author === "object" &&
    question?.author !== null &&
    "_id" in question.author
      ? String((question.author as { _id?: string })._id || "")
      : String(question?.author || "");
  const showQuestionActions =
    !!currentUserId && currentUserId === questionAuthorId;

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="group bg-primary/40 p-6 rounded-2xl border border-white/5 hover:border-main/40 hover:bg-primary/55 transition-all duration-300">
        <Link
          href={Routes.question_details(question._id)}
          className="block mb-6 text-xl font-semibold text-white/95 leading-snug transition-all duration-200 hover:text-main hover:underline hover:underline-offset-4 hover:decoration-main/70"
        >
          {question.title}
        </Link>

        <div className="mt-1 flex flex-wrap gap-2 mb-7">
          {question.tags.map((tag, i) =>
            (() => {
              const tagName =
                typeof tag === "object" && tag !== null && "name" in tag
                  ? (tag as { name: string }).name
                  : String(tag);
              const href = `/?filter=${encodeURIComponent(tagName)}&page=1`;

              return (
                <Tags key={i} href={href}>
                  {tagName}
                </Tags>
              );
            })()
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
              <Image
                src={
                  typeof question?.author === "object" &&
                  question?.author !== null &&
                  "image" in question.author
                    ? (question.author as { image?: string }).image || Logo
                    : Logo
                }
                alt="Author"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-white/10"
              />
              <span className="text-gray-200 font-medium">
                {typeof question?.author === "object" &&
                question?.author !== null &&
                "name" in question.author
                  ? (question.author as { name: string }).name
                  : "Unknown"}
              </span>{" "}
              {question?.createdAt
                ? `asked ${formatRelativeTime(question.createdAt)}`
                : ""}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <AiOutlineLike className="w-4 h-4" />
              <span>{question?.upvotes || 0} Likes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaRegCommentDots className="w-4 h-4" />
              <span>{question?.answers || 0} Answers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AiOutlineEye className="w-4 h-4" />
              <span>{question.views || 0} Views</span>
            </div>
            <div className="min-w-21 flex justify-end">
              <Action
                type="question"
                typeId={String(question?._id || "")}
                showActions={showQuestionActions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreadCard;
