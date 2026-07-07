"use client";

import { FiLogOut } from "react-icons/fi";
import { logoutAction } from "@/lib/actions/logout.action";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
  labelClassName?: string;
};

function LogoutButton({
  className,
  iconClassName = "text-lg",
  showLabel = false,
  labelClassName,
}: LogoutButtonProps) {
  return (
    <form action={logoutAction} className="inline-flex">
      <button
        type="submit"
        title="Logout"
        aria-label="Logout"
        className={cn("inline-flex cursor-pointer items-center justify-center gap-2", className)}
      >
        <FiLogOut className={iconClassName} />
        {showLabel ? (
          <span className={labelClassName}>Logout</span>
        ) : (
          <span className="sr-only">Logout</span>
        )}
      </button>
    </form>
  );
}

export default LogoutButton;
