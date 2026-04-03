import { BsBookmarkFill } from "react-icons/bs";

function Loading() {
  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-200 mx-auto animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-main/10 border border-main/20">
            <BsBookmarkFill className="w-6 h-6 text-main/60" />
          </div>
          <div className="h-10 w-56 rounded-md bg-white/10" />
        </div>
        <div className="h-10 w-40 rounded-lg bg-white/10" />
      </div>

      <div className="flex flex-wrap gap-2 px-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-9 w-24 rounded-full bg-white/10" />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-primary/40 p-5"
          >
            <div className="h-6 w-2/3 rounded-md bg-white/10" />
            <div className="mt-4 h-4 w-full rounded-md bg-white/10" />
            <div className="mt-2 h-4 w-4/5 rounded-md bg-white/10" />
            <div className="mt-5 flex items-center justify-between">
              <div className="h-8 w-28 rounded-full bg-white/10" />
              <div className="h-8 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;
