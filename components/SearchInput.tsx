"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoIosSearch, IoIosClose } from "react-icons/io";
import qs from "query-string";
import { useDebounce } from "use-debounce";

function SearchInputContent({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  // useDebounce returns [use-debounce package]
  const [debouncedValue] = useDebounce(searchValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on shortcut key (e.g., '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // For the search value to be updated in the URL
  useEffect(() => {
    const currentParams = qs.parse(searchParams.toString());
    const currentSearch = currentParams.search || "";

    if (currentSearch === debouncedValue) return;
    const newParams = {
      ...currentParams,
      search: debouncedValue || undefined,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: newParams,
      },
      { skipNull: true, skipEmptyString: true }
    );

    replace(url);
  }, [debouncedValue, searchParams, replace]);

  const handleClear = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-2xl group">
      <div
        className={`absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-main text-gray-400 sm:left-4 ${
          compact ? "left-3" : ""
        }`}
      >
        <IoIosSearch className={compact ? "text-lg" : "text-xl"} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={compact ? "Search..." : "Search questions, tags, users..."}
        className={`w-full border border-white/10 bg-primary/40 text-white transition-all placeholder:text-gray-500 focus:border-main/50 focus:bg-primary/60 focus:outline-none ${
          compact
            ? "rounded-lg py-2.5 pl-10 pr-10 text-sm"
            : "rounded-xl py-3 pl-12 pr-16"
        }`}
      />

      <div
        className={`absolute inset-y-0 right-3 flex items-center gap-2 sm:right-4 ${
          compact ? "right-3" : ""
        }`}
      >
        {searchValue && (
          <button
            onClick={handleClear}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            title="Clear search"
          >
            <IoIosClose className={compact ? "text-xl" : "text-2xl"} />
          </button>
        )}

        {!searchValue && !compact && (
          <div className="pointer-events-none hidden items-center rounded border border-gray-600 bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-gray-500 sm:flex">
            /
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap with Suspense to prevent Next.js build-time/runtime errors when using useSearchParams in layouts
function SearchInput({ compact = false }: { compact?: boolean }) {
  return (
    <Suspense
      fallback={
        <div
          className={`w-full animate-pulse bg-primary/50 ${
            compact ? "h-10 rounded-lg" : "h-12 rounded-xl"
          }`}
        />
      }
    >
      <SearchInputContent compact={compact} />
    </Suspense>
  );
}

export default SearchInput;
