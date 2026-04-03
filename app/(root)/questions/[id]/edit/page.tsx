import getQuestion from "@/lib/actions/getQuestion.action";
import QuestionForm from "../../components/QuestionForm";
import type { Metadata } from "next";
import { id } from "zod/v4/locales";

export const metadata: Metadata = {
  title: "Edit Question",
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: question, success } = await getQuestion(id);
  if (!success) throw new Error("Question not found");
  return (
    <>
      <QuestionForm question={question} isEdit={true} />
    </>
  );
}
