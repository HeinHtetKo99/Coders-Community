function RightSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="flex flex-col gap-6">
        <div className="h-7 w-40 rounded-md bg-white/10" />
        <div className="flex flex-col gap-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="mt-1 h-4 w-4 rounded-full bg-main/40" />
              <div className="h-4 w-full rounded-md bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="h-7 w-16 rounded-md bg-white/10" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-primary/20 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-white/10" />
                <div className="h-4 w-20 rounded-md bg-white/10" />
              </div>
              <div className="h-3 w-6 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="h-7 w-24 rounded-md bg-white/10" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-4 w-full rounded-md bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightSidebarSkeleton;
