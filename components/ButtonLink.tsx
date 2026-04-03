import Link from "next/link";
import React from "react";

function ButtonLink({
  icon,
  href,
  children,
  variant,
  className = "",
  ...props
}: {
  icon?: string | React.ReactNode;
  href: string;
  children: string;
  className?: string;
  variant?: "normal" | "outlined";
}) {
  return (
    <Link
      href={href}
      {...props}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
        variant === "outlined"
          ? "border-2 border-main hover:bg-main/10"
          : "bg-main text-white hover:bg-main/90"
      } ${className}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default ButtonLink;
