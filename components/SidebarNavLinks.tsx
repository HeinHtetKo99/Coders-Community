"use client";

import Routes from "@/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BsBookmarkStarFill,
  BsFire,
  BsHouseDoorFill,
  BsNewspaper,
  BsPeopleFill,
  BsTagsFill,
} from "react-icons/bs";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
  isActive: (pathname: string) => boolean;
  protected?: boolean;
};

const navItems: NavItem[] = [
  {
    href: Routes.Home,
    label: "Home",
    icon: BsHouseDoorFill,
    isActive: (pathname) => pathname === Routes.Home,
  },
  {
    href: Routes.tags,
    label: "Tags",
    icon: BsTagsFill,
    isActive: (pathname) => pathname.startsWith(Routes.tags),
  },
  {
    href: Routes.questions,
    label: "Popular",
    icon: BsFire,
    isActive: (pathname) => pathname === Routes.questions,
  },
  {
    href: Routes.bookmarks,
    label: "Bookmarks",
    icon: BsBookmarkStarFill,
    isActive: (pathname) => pathname.startsWith(Routes.bookmarks),
    protected: true,
  },
  {
    href: Routes.community,
    label: "Community",
    icon: BsPeopleFill,
    isActive: (pathname) => pathname.startsWith(Routes.community),
  },
  {
    href: Routes.techNews,
    label: "Tech News",
    icon: BsNewspaper,
    isActive: (pathname) => pathname.startsWith(Routes.techNews),
  },
];

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
        title={item.label}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group shrink-0 snap-start font-semibold transition-all",
          "flex flex-col items-center justify-center gap-1 rounded-xl xl:flex-row xl:gap-4 xl:rounded-2xl",
          "h-14 w-14 xl:h-auto xl:w-full xl:px-6 xl:py-4",
          active
            ? "bg-main text-white shadow-md shadow-main/25 xl:shadow-lg xl:shadow-main/20"
            : "bg-primary/30 text-gray-400 hover:bg-primary/50 hover:text-white xl:border xl:border-white/5"
        )}
      >
        <Icon className="text-[1.35rem] xl:text-xl" />
        <span className="max-w-full truncate text-[10px] font-medium leading-none xl:text-lg">
          {item.label}
        </span>
      </Link>
    );
  });
}

export default SidebarNavLinks;
