import Link from "next/link";
import React from "react";

function Tags({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-1.5 bg-secondary text-gray-300 text-xs font-medium rounded-lg border border-white/5"
    >
      {children}
    </Link>
  );
}

export default Tags;
