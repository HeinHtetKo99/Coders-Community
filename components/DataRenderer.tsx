import React from "react";
import { FiAlertCircle, FiInbox } from "react-icons/fi";

function DataRenderer({
  success,
  data,
  message,
  render,
  emptyTitle = "No Threads Found",
  emptyDescription = "No results match your current search or filter.",
  errorDescription = "We couldn’t load threads right now. Please try again.",
}: {
  success: boolean;
  data: any[];
  message?: string;
  render: (data: any[]) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  errorDescription?: string;
}) {
  if (!success)
    return (
      <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
        <div className="flex items-center gap-3 text-red-300">
          <FiAlertCircle className="h-6 w-6 shrink-0" />
          <p className="text-lg font-semibold">Something went wrong</p>
        </div>
        <p className="mt-3 text-sm text-red-200/90">
          {message || errorDescription}
        </p>
      </div>
    );
  if (!data || !data.length)
    return (
      <div className="mt-2 rounded-2xl border border-white/10 bg-primary/30 p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-secondary/60 text-main">
          <FiInbox className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-gray-400">{emptyDescription}</p>
      </div>
    );
  return <div>{render(data || [])}</div>;
}

export default DataRenderer;
