import { Ianswer } from "@/database/Answer.model";
import PreviewContent from "@/components/PreviewContent";
import Image from "next/image";
import Logo from "@/public/profile.jpg";
import React, { Suspense } from "react";
import VotesButton from "./VotesButton";
import Action from "./Action";
import VotesButtonSkeleton from "./VotesButtonSkeleton";

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

function AnswerCard({
  answer,
  currentUserId = "",
}: {
  answer: Ianswer | any;
  currentUserId?: string;
}) {
  const authorName =
    typeof answer?.author === "object" &&
    answer?.author !== null &&
    "name" in answer.author
      ? (answer.author as { name?: string }).name || "Unknown"
      : "Unknown";

  const authorImage =
    typeof answer?.author === "object" &&
    answer?.author !== null &&
    "image" in answer.author
      ? (answer.author as { image?: string }).image || ""
      : "";

  const createdLabel = answer?.createdAt
    ? formatRelativeTime(answer.createdAt)
    : "";
  const answerAuthorId =
    typeof answer?.author === "object" &&
    answer?.author !== null &&
    "_id" in answer.author
      ? String((answer.author as { _id?: string })._id || "")
      : String(answer?.author || "");
  const showAnswerActions = !!currentUserId && currentUserId === answerAuthorId;

  return (
    <div className="group mt-4 first:mt-0 bg-primary/30 p-6 rounded-2xl border border-white/5 hover:border-main/30 hover:bg-primary/40 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Image
            src={authorImage || Logo}
            alt={authorName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-white/10"
          />
          <span className="text-gray-200 font-medium">{authorName}</span>
          <span className="text-white/20">•</span>
          <span className="text-gray-400">
            {createdLabel ? `answered ${createdLabel}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <Suspense fallback={<VotesButtonSkeleton />}>
            <VotesButton
              getVotePromise={Promise.resolve({
                success: true,
                data: { voteType: answer?.userVote || null },
              })}
              type="answer"
              typeId={answer?._id.toString() || answer?.id || ""}
              initialUpvotes={answer?.upvotes || 0}
              initialDownvotes={answer?.downvotes || 0}
            />
          </Suspense>
          <div className="min-w-21 flex justify-end">
            <Action
              type="answer"
              typeId={String(answer?._id || answer?.id || "")}
              showActions={showAnswerActions}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-white/5 pt-5">
        <PreviewContent content={answer?.content || ""} />
      </div>
    </div>
  );
}

export default AnswerCard;
