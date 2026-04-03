"use client";
import Button from "@/components/Button";
import TextEditor from "@/components/TextEditor";
import { createAnswer } from "@/lib/actions/createAnswer.action";
import generateAiAnswerAction from "@/lib/actions/generateAiAnswerAction.action";
import { useRouter } from "next/navigation";
import React, { startTransition, useState } from "react";
import { Bounce, toast } from "react-toastify";

function AnswerForm({
  questionId,
  questionTitle,
  questionContent,
}: {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!content.trim()) {
        toast.error("Content is required", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      const { data, success, message } = await createAnswer({
        questionId: questionId,
        content,
      });
      if (!success) {
        toast.error(message || "Internal server error", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      setContent("");
      if (data && success) {
        toast.success("Answer created successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (e: any) {
      toast.error(e?.message || "Internal server error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const generateAiAnswer = async () => {
    try {
      setLoading(true);
      const { data, success } = await generateAiAnswerAction({
        content: questionContent,
        title: questionTitle,
        userAnswer: content,
      });
      if (data && success) {
        const { answer = "" } = data || {};
        setContent(answer);
      }
      setLoading(false);
    } catch (e: any) {
      toast.error(e?.message || "Internal server error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-8 border-t border-white/5 pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Your Answer
        </h2>
        <p className="text-sm text-gray-400">
          Provide details and add code snippets if needed.
        </p>
      </div>

      <form
        className="mt-5 flex flex-col gap-4 p-5 bg-primary/20 rounded-2xl border border-white/5"
        onSubmit={submit}
      >
        <TextEditor value={content} onChange={(v) => setContent(v)} />
        <div className="flex items-center gap-2 px-1 text-sm text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-main"
          >
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <p>
            Start typing to enable{" "}
            <span className="text-main font-medium">AI answer generation</span>.
            (Min 5 characters)
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
            {content.length > 5 && (
              <Button
                variant="outlined"
                className="w-full sm:w-48 py-3 font-semibold"
                type="button"
                onClick={generateAiAnswer}
              >
                {loading ? "Loading..." : "Generate Ai Answer"}
              </Button>
            )}
            <Button className="w-full sm:w-48 py-3 font-semibold" type="submit">
              Submit Answer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AnswerForm;
