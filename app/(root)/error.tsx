"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import Button from "@/components/Button";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-10">
      <div className="rounded-2xl border border-white/10 bg-primary/30 p-10 text-center max-w-xl mx-auto">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-main/10 flex items-center justify-center">
          <AiOutlineWarning className="w-7 h-7 text-main" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-white tracking-tight">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          We couldn’t load the community right now. Please try again.
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Button onClick={() => unstable_retry()} className="min-w-28">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
