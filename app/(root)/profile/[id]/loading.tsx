import UserProfileSkeleton from "./components/UserProfileSkeleton";

function Loading() {
  return (
    <div className="py-8">
      <UserProfileSkeleton />

      <div className="mt-8 flex gap-4 border-b border-white/5 pb-4 animate-pulse">
        <div className="h-10 w-28 rounded-lg bg-white/10" />
        <div className="h-10 w-24 rounded-lg bg-white/10" />
      </div>

      <div className="mt-6 flex flex-col gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-primary/40 p-5"
          >
            <div className="h-6 w-3/4 rounded-md bg-white/10" />
            <div className="mt-4 h-4 w-full rounded-md bg-white/10" />
            <div className="mt-2 h-4 w-5/6 rounded-md bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;
