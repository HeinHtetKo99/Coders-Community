"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/constant/navItems";
import { cn } from "@/lib/utils";

function MobileNavBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const visibleNavItems = navItems.filter(
    (item) => !item.protected || isAuthenticated
  );

  return (
    <nav
      aria-label="Main navigation"
      className="grid w-full gap-1"
      style={{
        gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))`,
      }}
    >
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const active = item.isActive(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className="group relative flex flex-col items-center justify-center py-1.5"
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                active
                  ? "bg-main text-white"
                  : "text-gray-500 group-hover:bg-white/5 group-hover:text-gray-300"
              )}
            >
              <Icon className="text-[1.15rem]" />
            </span>
            <span className="sr-only">{item.label}</span>
            {active && (
              <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-main" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileNavBar;
