"use client";
import { voteAction } from "@/lib/actions/voteAction.action";
import { use, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { Bounce, toast } from "react-toastify";

function VotesButton({
  getVotePromise,
  typeId,
  type,
  initialUpvotes,
  initialDownvotes,
}: {
  getVotePromise: Promise<{
    success: boolean;
    data?: {
      voteType?: "upvote" | "downvote" | null;
    };
    message?: string;
    details?: object | null;
  }>;
  typeId: string;
  type: "question" | "answer";
  initialUpvotes: number;
  initialDownvotes: number;
}) {
  const { data, success } = use(getVotePromise);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [uservotes, setUservotes] = useState<null | "upvote" | "downvote">(
    success ? data?.voteType || null : null
  );
  const handleVotes = async (vote: "upvote" | "downvote" | null) => {
    try {
      const { success, data, message } = await voteAction({
        type,
        typeId,
        voteType: vote,
      });
      if (success && data) {
        setUpvotes(data?.upvotes || 0);
        setDownvotes(data?.downvotes || 0);
        setUservotes(data?.userVote || null);
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
    <div className="flex items-center gap-3 text-sm">
      <button
        onClick={() => handleVotes("upvote")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
          uservotes === "upvote"
            ? "bg-white border-white text-main font-medium"
            : "border-white/5 bg-secondary/40 text-gray-300 hover:bg-white/5"
        }`}
      >
        <AiOutlineLike className="w-4 h-4" />
        <span>{upvotes} Likes</span>
      </button>

      <button
        onClick={() => handleVotes("downvote")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
          uservotes === "downvote"
            ? "bg-red-100 border-red-100 text-red-500 font-medium"
            : "border-white/5 bg-secondary/40 text-gray-300 hover:bg-white/5"
        }`}
      >
        <AiOutlineDislike className="w-4 h-4" />
        <span>{downvotes} Dislikes</span>
      </button>
    </div>
  );
}

export default VotesButton;
