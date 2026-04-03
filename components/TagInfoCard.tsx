"use client";

import Link from "next/link";
import React from "react";
import { getTagIcon } from "@/components/tagIcons";

function TagInfoCard({
  tagId,
  tag,
  count,
}: {
  tagId: string;
  tag: { name: string };
  count: number;
}) {
  const tagIcon = getTagIcon(tag.name);
  const Icon = tagIcon.icon;
  return (
    <Link
      href={`/tags/${tagId}`}
      className="bg-primary/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tagIcon.badgeClassName}`}
        >
          <Icon className={`text-xl ${tagIcon.iconClassName}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white tracking-tight truncate">
            {tag.name}
          </h2>
          <p className="mt-1 text-sm text-gray-400">{count} questions</p>
        </div>
      </div>
    </Link>
  );
}

export default TagInfoCard;
