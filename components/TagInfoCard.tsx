"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useMemo, useState } from "react";

function TagInfoCard({
  tagId,
  tag,
  count,
}: {
  tagId: string;
  tag: { name: string };
  count: number;
}) {
  const iconName = useMemo(() => {
    const raw = String(tag.name || "")
      .trim()
      .toLowerCase();
    const mapped: Record<string, string> = {
      "node.js": "nodejs",
      "next.js": "nextjs",
      "express.js": "express",
      "react.js": "react",
      "vue.js": "vuejs",
      "c++": "cplusplus",
      "c#": "csharp",
      "tailwind css": "tailwindcss",
    };

    if (mapped[raw]) return mapped[raw];

    return raw
      .replace(/\s+/g, "")
      .replace(/\./g, "")
      .replace(/\+/g, "plus")
      .replace(/#/g, "sharp")
      .replace(/\//g, "");
  }, [tag.name]);

  const fallbackSrc = useMemo(() => {
    const letter = (String(tag.name || "").trim()[0] || "?").toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="0.5" y="0.5" width="47" height="47" rx="12" fill="#05061b" stroke="rgba(255,255,255,0.10)"/><text x="24" y="28" text-anchor="middle" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="18" font-weight="700" fill="rgba(255,255,255,0.92)">${letter}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [tag.name]);

  const originalSrc = useMemo(
    () =>
      `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/${iconName}/${iconName}-original.svg`,
    [iconName]
  );
  const plainSrc = useMemo(
    () =>
      `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/${iconName}/${iconName}-plain.svg`,
    [iconName]
  );

  const [src, setSrc] = useState(originalSrc);
  const [attempt, setAttempt] = useState<0 | 1 | 2>(0);
  const isFallback = src.startsWith("data:image/svg+xml");
  return (
    <Link
      href={`/tags/${tagId}`}
      className="bg-primary/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/60 border border-white/10">
          <Image
            src={src}
            alt={tag.name}
            width={24}
            height={24}
            className="h-6 w-6"
            unoptimized={isFallback}
            onError={() => {
              if (attempt === 0) {
                setSrc(plainSrc);
                setAttempt(1);
                return;
              }
              if (attempt === 1) {
                setSrc(fallbackSrc);
                setAttempt(2);
              }
            }}
          />
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
