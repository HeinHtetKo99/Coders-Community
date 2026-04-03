import { BsCodeSlash } from "react-icons/bs";
import {
  FaBootstrap,
  FaCss3Alt,
  FaDatabase,
  FaHtml5,
  FaJava,
  FaJs,
  FaLaravel,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaReact,
  FaVuejs,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { SiMongodb, SiNextdotjs, SiTypescript } from "react-icons/si";

export type TagIconConfig = {
  icon: IconType;
  iconClassName: string;
  badgeClassName: string;
};

const DEFAULT_TAG_ICON: TagIconConfig = {
  icon: BsCodeSlash,
  iconClassName: "text-gray-300",
  badgeClassName: "bg-white/5 ring-white/10",
};

const TAG_ICON_MAP: Record<string, TagIconConfig> = {
  react: {
    icon: FaReact,
    iconClassName: "text-sky-400",
    badgeClassName: "bg-sky-500/15 ring-sky-400/30",
  },
  "react.js": {
    icon: FaReact,
    iconClassName: "text-sky-400",
    badgeClassName: "bg-sky-500/15 ring-sky-400/30",
  },
  vue: {
    icon: FaVuejs,
    iconClassName: "text-emerald-500",
    badgeClassName: "bg-emerald-500/15 ring-emerald-400/30",
  },
  vuejs: {
    icon: FaVuejs,
    iconClassName: "text-emerald-500",
    badgeClassName: "bg-emerald-500/15 ring-emerald-400/30",
  },
  "vue.js": {
    icon: FaVuejs,
    iconClassName: "text-emerald-500",
    badgeClassName: "bg-emerald-500/15 ring-emerald-400/30",
  },
  laravel: {
    icon: FaLaravel,
    iconClassName: "text-red-500",
    badgeClassName: "bg-red-500/15 ring-red-400/30",
  },
  python: {
    icon: FaPython,
    iconClassName: "text-blue-400",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  node: {
    icon: FaNodeJs,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  "node.js": {
    icon: FaNodeJs,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  nodejs: {
    icon: FaNodeJs,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  next: {
    icon: SiNextdotjs,
    iconClassName: "text-gray-100",
    badgeClassName: "bg-white/10 ring-white/20",
  },
  "next.js": {
    icon: SiNextdotjs,
    iconClassName: "text-gray-100",
    badgeClassName: "bg-white/10 ring-white/20",
  },
  nextjs: {
    icon: SiNextdotjs,
    iconClassName: "text-gray-100",
    badgeClassName: "bg-white/10 ring-white/20",
  },
  javascript: {
    icon: FaJs,
    iconClassName: "text-yellow-400",
    badgeClassName: "bg-yellow-500/15 ring-yellow-400/30",
  },
  js: {
    icon: FaJs,
    iconClassName: "text-yellow-400",
    badgeClassName: "bg-yellow-500/15 ring-yellow-400/30",
  },
  typescript: {
    icon: SiTypescript,
    iconClassName: "text-blue-400",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  ts: {
    icon: SiTypescript,
    iconClassName: "text-blue-400",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  html: {
    icon: FaHtml5,
    iconClassName: "text-orange-500",
    badgeClassName: "bg-orange-500/15 ring-orange-400/30",
  },
  css: {
    icon: FaCss3Alt,
    iconClassName: "text-blue-500",
    badgeClassName: "bg-blue-500/15 ring-blue-400/30",
  },
  php: {
    icon: FaPhp,
    iconClassName: "text-indigo-400",
    badgeClassName: "bg-indigo-500/15 ring-indigo-400/30",
  },
  mongodb: {
    icon: SiMongodb,
    iconClassName: "text-green-500",
    badgeClassName: "bg-green-500/15 ring-green-400/30",
  },
  database: {
    icon: FaDatabase,
    iconClassName: "text-purple-300",
    badgeClassName: "bg-purple-500/15 ring-purple-400/30",
  },
  java: {
    icon: FaJava,
    iconClassName: "text-orange-400",
    badgeClassName: "bg-orange-500/15 ring-orange-400/30",
  },
  bootstrap: {
    icon: FaBootstrap,
    iconClassName: "text-violet-400",
    badgeClassName: "bg-violet-500/15 ring-violet-400/30",
  },
};

export function getTagIcon(tagName: string): TagIconConfig {
  const normalizedName = tagName.trim().toLowerCase();
  return TAG_ICON_MAP[normalizedName] ?? DEFAULT_TAG_ICON;
}
