function Loading() {
  return (
    <div className="flex flex-col gap-6 py-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-40 rounded-md bg-white/10" />
          <div className="h-4 w-72 max-w-full rounded-md bg-white/10" />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="h-10 w-full sm:w-48 rounded-lg bg-white/10" />
          <div className="hidden sm:block h-4 w-20 rounded-md bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-primary/40 p-5"
          >
            <div className="h-6 w-1/2 rounded-md bg-white/10" />
            <div className="mt-4 h-4 w-full rounded-md bg-white/10" />
            <div className="mt-2 h-4 w-4/5 rounded-md bg-white/10" />
            <div className="mt-4 h-8 w-16 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;
