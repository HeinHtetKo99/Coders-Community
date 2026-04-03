"use client";
import { toggleBookMarkAction } from "@/lib/actions/toggleBookMarkAction.action";
import React, { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { toast, Bounce } from "react-toastify";

function ToggleBookMark({
  questionId,
  saved,
}: {
  questionId: string;
  saved?: boolean;
}) {
  const [isSaved, setIsSaved] = useState(saved);

  const handleSave = async () => {
    try {
      const { success, data, message } = await toggleBookMarkAction({
        questionId,
      });
      if (success && data) {
        setIsSaved(data.saved);
      } else {
        throw new Error(message);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message, {
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
    }
  };

  return (
    <div>
      {!isSaved ? (
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-main text-main transition-all text-sm hover:bg-main/10 cursor-pointer"
        >
          <BsBookmark className="w-4 h-4" />
          <span>Save</span>
        </button>
      ) : (
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-main text-white transition-all text-sm hover:bg-main/90 cursor-pointer"
        >
          <BsBookmarkFill className="w-4 h-4" />
          <span>Unsave</span>
        </button>
      )}
    </div>
  );
}

export default ToggleBookMark;
