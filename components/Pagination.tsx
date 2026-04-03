"use client";
import { useRouter } from "next/navigation";
import queryString from "query-string";

function Pagination({ isNext, page }: { isNext: boolean; page: number }) {
  const router = useRouter();

  const handleClick = (type: "previous" | "next") => {
    const currentQuery = queryString.parse(window.location.search);
    const updatedQuery = {
      ...currentQuery,
      page: type === "previous" ? page - 1 : page + 1,
    };

    const url = queryString.stringifyUrl(
      {
        url: window.location.pathname,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };
  return (
    <div className="flex w-full items-center justify-center gap-2 mt-8">
      <button
        onClick={() => handleClick("previous")}
        disabled={page === 1}
        className="px-4 py-2.5 rounded-lg border border-white/5 bg-primary/40 text-gray-300 text-sm outline-none hover:bg-primary/60 hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        Previous
      </button>

      <div className="bg-main px-4 py-2.5 rounded-lg text-white font-medium text-sm shadow-sm">
        {page}
      </div>

      <button
        onClick={() => handleClick("next")}
        disabled={!isNext}
        className="px-4 py-2.5 rounded-lg border border-white/5 bg-primary/40 text-gray-300 text-sm outline-none hover:bg-primary/60 hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
