import Routes from "@/routes";
import {
  BsBookmarkStarFill,
  BsFire,
  BsHouseDoorFill,
  BsNewspaper,
  BsPeopleFill,
  BsTagsFill,
} from "react-icons/bs";
import { IconType } from "react-icons";

export type NavItem = {
  href: string;
  label: string;
  icon: IconType;
  isActive: (pathname: string) => boolean;
  protected?: boolean;
};

export const navItems: NavItem[] = [
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
