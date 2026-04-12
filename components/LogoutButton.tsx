"use client";

import { signOut } from "next-auth/react";
import React from "react";

function LogoutButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      {children}
    </button>
  );
}

export default LogoutButton;

