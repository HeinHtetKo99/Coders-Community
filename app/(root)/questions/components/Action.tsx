"use client";

import { deleteQuestionAction } from "@/lib/actions/deleteQuestion.action";
import { deleteAnswerAction } from "@/lib/actions/deleteAnswer.action";
import Routes from "@/routes";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Bounce, toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ActionItemType = "question" | "answer";
type ActionKind = "edit" | "delete";

function Action({
  type,
  typeId,
  showActions,
}: {
  type: ActionItemType;
  typeId: string;
  showActions: boolean;
}) {
  const router = useRouter();
  const canEdit = type === "question";

  const submitAction = async (action: ActionKind) => {
    if (action === "edit" && canEdit) {
      router.push(Routes.question_edit(typeId));
      return;
    }

    if (action === "delete") {
      const { success, message } =
        type === "question"
          ? await deleteQuestionAction({
              questionId: typeId,
            })
          : await deleteAnswerAction({
              answerId: typeId,
            });

      const itemLabel = type === "question" ? "Question" : "Answer";
      if (success) {
        toast.success(`${itemLabel} deleted successfully`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        if (type === "question") {
          router.replace(Routes.Home);
          return;
        }
        router.refresh();
      } else {
        toast.error(message || `Failed to delete ${type}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  };

  if (!showActions) return null;

  return (
    <div className="flex items-center gap-2">
      {canEdit ? (
        <button
          type="button"
          onClick={() => submitAction("edit")}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-primary/50 px-2.5 py-1.5 text-xs text-gray-300 transition-colors hover:border-main/40 hover:text-white"
          aria-label={`Edit ${type}`}
        >
          <AiOutlineEdit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      ) : null}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-300 transition-colors hover:border-red-400/40 hover:text-red-200"
            aria-label={`Delete ${type}`}
          >
            <AiOutlineDelete className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              item from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => submitAction("delete")}
              className="bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Action;
