import React from "react";

function Button({
  icon,
  children,
  variant,
  className = "",
  ...props
}: {
  icon?: string | React.ReactNode;
  children: string;
  variant?: "normal" | "outlined";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
        variant === "outlined"
          ? "border-2 border-main hover:bg-main/10"
          : "bg-main text-white hover:bg-main/90"
      } ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

export default Button;
