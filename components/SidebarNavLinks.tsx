"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/constant/navItems";
import { cn } from "@/lib/utils";

function SidebarNavLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const visibleNavItems = navItems.filter(
    (item) => !item.protected || isAuthenticated
  );

  return visibleNavItems.map((item) => {
    const Icon = item.icon;
    const active = item.isActive(pathname);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-4 rounded-2xl px-6 py-4 font-semibold transition-all",
          active
            ? "bg-main text-white shadow-lg shadow-main/20"
            : "border border-white/5 bg-primary/40 text-gray-300 hover:bg-primary/60 hover:text-white"
        )}
      >
        <Icon className="text-xl" />
        <span className="text-lg">{item.label}</span>
      </Link>
    );
  });
}

export default SidebarNavLinks;
