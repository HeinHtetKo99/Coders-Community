"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogIn } from "react-icons/fi";
import { navItems } from "@/constant/navItems";
import Routes from "@/routes";
import LogoutButton from "./LogoutButton";
import { cn } from "@/lib/utils";

function MobileNavBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const visibleNavItems = navItems.filter(
    (item) => !item.protected || isAuthenticated
  );
  const columnCount = visibleNavItems.length + 1;

  return (
    <nav
      aria-label="Main navigation"
      className="grid w-full gap-1"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
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

      {isAuthenticated ? (
        <div className="flex flex-col items-center justify-center py-1.5">
          <LogoutButton
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 transition-all hover:bg-red-500 hover:text-white"
            iconClassName="text-[1.15rem]"
          />
        </div>
      ) : (
        <Link
          href={Routes.Login}
          title="Login"
          aria-label="Login"
          className="group flex flex-col items-center justify-center py-1.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-main/25 bg-main/10 text-main transition-all group-hover:bg-main group-hover:text-white">
            <FiLogIn className="text-[1.15rem]" />
          </span>
          <span className="sr-only">Login</span>
        </Link>
      )}
    </nav>
  );
}

export default MobileNavBar;
