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
        className={`flex items-center gap-3 xl:gap-4 px-4 xl:px-6 py-3 xl:py-4 rounded-2xl font-semibold transition-all shrink-0 ${
          active
            ? "bg-main text-white shadow-lg shadow-main/20"
            : "bg-primary/40 text-gray-300 hover:bg-primary/60 hover:text-white border border-white/5"
        }`}
      >
        <Icon className="text-xl" />
        <span className="max-xl:hidden text-lg">{item.label}</span>
      </Link>
    );
  });
}

export default SidebarNavLinks;
