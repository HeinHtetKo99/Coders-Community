import React from "react";
import { IoIosClose } from "react-icons/io";

function RemoveTag({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-gray-300 text-xs font-medium rounded-lg border border-white/5">
      <span className="leading-none">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <IoIosClose className="text-base" />
      </button>
    </div>
  );
}

export default RemoveTag;
