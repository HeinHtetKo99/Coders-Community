"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoIosSearch, IoIosClose } from "react-icons/io";
import qs from "query-string";
import { useDebounce } from "use-debounce";

function SearchInputContent() {
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
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-main text-gray-400">
        <IoIosSearch className="text-xl" />
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search everything..."
        className="w-full bg-secondary/50 border border-white/5 text-white rounded-xl py-3 pl-12 pr-16 focus:outline-none focus:border-main/50 focus:bg-secondary transition-all placeholder:text-gray-500"
      />

      {/* Action Buttons (Clear & Shortcut Hint) */}
      <div className="absolute inset-y-0 right-4 flex items-center gap-2">
        {searchValue && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
            title="Clear search"
          >
            <IoIosClose className="text-2xl" />
          </button>
        )}

        {!searchValue && (
          <div className="hidden sm:flex items-center px-2 py-0.5 border border-gray-600 rounded text-[10px] text-gray-500 font-mono bg-secondary/50 pointer-events-none">
            /
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap with Suspense to prevent Next.js build-time/runtime errors when using useSearchParams in layouts
function SearchInput() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-10 bg-primary rounded-full animate-pulse" />
      }
    >
      <SearchInputContent />
    </Suspense>
  );
}

export default SearchInput;
