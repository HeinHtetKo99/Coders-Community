import React from "react";
import { cn } from "@/lib/utils";

function Input({
  placeholder,
  label,
  type,
  className,
  ...props
}: {
  type?: string;
  placeholder?: string;
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      {label && <label className="text-gray-300">{label}</label>}
      <input
        {...props}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-white/10 px-4 py-2.5 text-white outline-none transition-colors focus:border-main/50 focus:ring-1 focus:ring-main/30",
          className
        )}
      />
    </>
  );
}

export default Input;
