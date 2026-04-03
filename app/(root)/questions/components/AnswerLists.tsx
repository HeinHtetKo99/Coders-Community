import DataRenderer from "@/components/DataRenderer";
import AnswerCard from "./AnswerCard";
import { getAnswers } from "@/lib/actions/getAnswers.action";

async function AnswerLists({
  page,
  pageSize,
  filter,
  id,
}: {
  page: number;
  pageSize: number;
  filter: string;
  id: string;
}) {
  const {
    data: answerData,
    success: answerSuccess,
    message: answerErrorMessage,
  } = await getAnswers({
    page: Number(page),
    pageSize: Number(pageSize),
    questionId: id,
    filter: filter,
  });
  const { answers = [] } = answerData || {};
  const safeAnswers = Array.isArray(answers) ? answers : [];

  return (
    <div className="flex flex-col gap-4">
      <DataRenderer
        success={answerSuccess}
        message={answerErrorMessage}
        data={safeAnswers}
        emptyTitle="No Answers Yet"
        emptyDescription="Be the first one to answer this question."
        errorDescription="We couldn’t load answers right now. Please try again."
        render={(answers) => (
          <div className="flex flex-col gap-4">
            {answers.map((answer, i) => (
              <AnswerCard
                key={String((answer as any)?._id ?? i)}
                answer={answer}
                currentUserId={answer?.author?._id || ""}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
}

export default AnswerLists;
