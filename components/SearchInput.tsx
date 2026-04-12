import React from "react";

function SearchInput() {
  return (
    <form action="" method="GET" className="relative w-full max-w-2xl group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-main text-gray-400">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16.5 16.5 21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <input
        type="text"
        name="search"
        placeholder="Search everything..."
        className="w-full bg-secondary/50 border border-white/5 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-main/50 focus:bg-secondary transition-all placeholder:text-gray-500"
      />
    </form>
  );
}

export default SearchInput;
