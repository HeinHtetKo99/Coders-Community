import getQuestion from "@/lib/actions/getQuestion.action";
import Tags from "@/components/Tags";
import Image from "next/image";
import Logo from "@/public/profile.jpg";
import { AiOutlineEye } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import PreviewContent from "@/components/PreviewContent";
import { after } from "next/server";
import incrementViews from "@/lib/actions/incrementViews.action";
import AnswerForm from "../components/AnswerForm";
import AnswerLists from "../components/AnswerLists";
import VotesButton from "../components/VotesButton";
import ToggleBookMark from "../components/ToggleBookMark";
import CommonFilter from "@/components/CommonFilter";
import { AnswerFilters, DefaultFilters } from "@/constant/filters";
import { auth } from "@/auth";
import Action from "../components/Action";
import { getVote } from "@/lib/actions/getVote.action";
import { Suspense } from "react";
import VotesButtonSkeleton from "../components/VotesButtonSkeleton";
import AnswerListsSkeleton from "../components/AnswerListsSkeleton";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: question } = await getQuestion(id);

  return {
    title: question?.title || "Question",
    description:
      typeof question?.content === "string"
        ? question.content.slice(0, 100)
        : "",
  };
}

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

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; filter?: string }>;
}) {
  const { id } = await params;
  const [{ data: question, success }, { page = 1, pageSize = 10, filter = "" }, session] =
    await Promise.all([getQuestion(id), searchParams, auth()]);
  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success) {
    return (
      <div className="py-10">
        <div className="rounded-2xl border border-white/10 bg-primary/30 p-10 text-center">
          <h3 className="text-xl font-semibold text-white">
            Question not found
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            This question may have been deleted or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const tags = Array.isArray(question?.tags) ? question.tags : [];
  const createdLabel = question?.createdAt
    ? formatRelativeTime(question.createdAt)
    : "";
  const currentUserId = String(session?.user?.id || "");

  const authorName =
    typeof question?.author === "object" &&
    question?.author !== null &&
    "name" in question.author
      ? (question?.author as { name: string }).name || "Unknown"
      : "Unknown";

  const authorImage =
    typeof question?.author === "object" &&
    question?.author !== null &&
    "image" in question.author
      ? (question?.author as { image: string }).image || ""
      : "";
  const questionAuthorId =
    typeof question?.author === "object" &&
    question?.author !== null &&
    "_id" in question.author
      ? String((question.author as { _id?: string })._id || "")
      : String(question?.author || "");
  const showQuestionActions =
    !!currentUserId && currentUserId === questionAuthorId;

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="bg-primary/40 p-6 rounded-2xl border border-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {question?.title || "Untitled Question"}
          </h1>
          <div className="sm:shrink-0">
            <Action
              type="question"
              typeId={id}
              showActions={showQuestionActions}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Image
              src={authorImage || Logo}
              alt="Author"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border border-white/10"
            />
            <span className="text-gray-200 font-medium">{authorName}</span>
            <span className="text-white/20">•</span>
            <span>{createdLabel ? `asked ${createdLabel}` : ""}</span>
          </div>

          <div className="flex items-center gap-5 text-gray-400 text-sm">
            {/* for upvotes & downvotes */}
            <Suspense fallback={<VotesButtonSkeleton />}>
              <VotesButton
                getVotePromise={getVote({ type: "question", typeId: id })}
                type="question"
                typeId={id}
                initialUpvotes={question?.upvotes || 0}
                initialDownvotes={question?.downvotes || 0}
              />
            </Suspense>
            <div className="flex items-center gap-1.5">
              <FaRegCommentDots className="w-4 h-4" />
              <span>{question?.answers || 0} Answers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AiOutlineEye className="w-4 h-4" />
              <span>{question?.views || 0} Views</span>
            </div>
            <div>
              <ToggleBookMark questionId={id} saved={question?.saved} />
            </div>
          </div>
        </div>

        {tags.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag: unknown, i: number) => {
              const tagName =
                typeof tag === "object" && tag !== null && "name" in tag
                  ? String((tag as { name: unknown }).name)
                  : String(tag);
              const tagId =
                typeof tag === "object" && tag !== null && "_id" in tag
                  ? String((tag as { _id: unknown })._id)
                  : tagName;

              return (
                <Tags key={tagId || i} href={`/tags/${tagId}`}>
                  {tagName}
                </Tags>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 border-t border-white/5 pt-6">
          <PreviewContent content={question?.content || ""} />
        </div>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-8">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Total Answers - {question?.answers || 0}
          </h3>
          <div className="flex flex-col"></div>
          <div className="w-full sm:w-auto">
            <CommonFilter
              filters={AnswerFilters}
              defaultFilter={DefaultFilters.AnswerFilters}
            />
          </div>
        </div>
        <div className="mt-6">
          <Suspense fallback={<AnswerListsSkeleton />}>
            <AnswerLists
              page={Number(page)}
              pageSize={Number(pageSize)}
              filter={filter}
              id={id}
            />
          </Suspense>
        </div>
        <div>
          <AnswerForm
            questionId={id}
            questionTitle={question?.title || ""}
            questionContent={question?.content || ""}
          />
        </div>
      </div>
    </div>
  );
}
