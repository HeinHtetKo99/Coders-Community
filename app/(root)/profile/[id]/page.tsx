import React, { Suspense } from "react";
import UserProfile from "./components/UserProfile";
import Link from "next/link";
import DataRenderer from "@/components/DataRenderer";
import ThreadCard from "@/components/ThreadCard";
import { getUserQuestions } from "@/lib/actions/getUserQuestions.action";
import AnswerCard from "../../questions/components/AnswerCard";
import { getUserAnswers } from "@/lib/actions/getUserAnswers.action";
import Pagination from "@/components/Pagination";
import { auth } from "@/auth";
import UserProfileSkeleton from "./components/UserProfileSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tab: string;
    page: number;
    pageSize: number;
  }>;
}) {
  const [{ id }, resolvedSearchParams, session] = await Promise.all([
    params,
    searchParams,
    auth(),
  ]);
  const { page = 1, pageSize = 10, tab } = resolvedSearchParams || {};
  const currentUserId = String(session?.user?.id || "");
  const activeTab = tab || "questions";
  const parsedPage = Number(page) || 1;
  const parsedPageSize = Number(pageSize) || 10;
  let dataFinal;
  let successFinal;
  let messageFinal;
  let isNextFinal;
  if (activeTab === "questions") {
    const { data, success, message } = await getUserQuestions({
      userId: id,
      page: parsedPage,
      pageSize: parsedPageSize,
    });
    const { questions = [], isNext = false } = data || {};
    dataFinal = questions;
    successFinal = success;
    messageFinal = message || "";
    isNextFinal = isNext;
  } else {
    const { data, success, message } = await getUserAnswers({
      userId: id,
      page: parsedPage,
      pageSize: parsedPageSize,
    });
    const { answers = [], isNext = false } = data || {};
    dataFinal = answers;
    successFinal = success;
    messageFinal = message || "";
    isNextFinal = isNext;
  }

  return (
    <div>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile userId={id} />
      </Suspense>

      <div className="flex gap-4 border-b border-white/5 pb-4 mt-8">
        <Link
          href={`/profile/${id}?tab=questions`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "questions" || !activeTab
              ? "bg-main text-white"
              : "text-gray-400 hover:text-white hover:bg-primary/40"
          }`}
        >
          All Questions
        </Link>
        <Link
          href={`/profile/${id}?tab=answers`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "answers"
              ? "bg-main text-white"
              : "text-gray-400 hover:text-white hover:bg-primary/40"
          }`}
        >
          All Answers
        </Link>
      </div>

      <div className="mt-6">
        {(activeTab === "questions" || !activeTab) && (
          <>
            <DataRenderer
              success={successFinal}
              message={messageFinal}
              data={dataFinal}
              emptyTitle="No Questions Yet"
              emptyDescription={`This user hasn't asked any questions yet.`}
              render={(questions) =>
                questions?.map((question) => (
                  <ThreadCard
                    key={question._id}
                    question={question}
                    currentUserId={currentUserId}
                  />
                ))
              }
            />
            <Pagination isNext={isNextFinal} page={parsedPage} />
          </>
        )}
        {activeTab === "answers" && (
          <>
            <DataRenderer
              success={successFinal}
              message={messageFinal}
              data={dataFinal}
              emptyTitle="No Answers Yet"
              emptyDescription={`This user hasn't answered any questions yet.`}
              render={(answers) =>
                answers?.map((answer) => (
                  <AnswerCard
                    key={answer._id}
                    answer={answer}
                    currentUserId={currentUserId}
                  />
                ))
              }
            />
            <Pagination isNext={isNextFinal} page={parsedPage} />
          </>
        )}
      </div>
    </div>
  );
}
