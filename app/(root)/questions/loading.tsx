function Loading() {
  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-200 mx-auto animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
        <div className="h-10 w-64 rounded-md bg-white/10" />
      </div>

      <div className="flex flex-wrap gap-2 px-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-9 w-24 rounded-full bg-white/10" />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-primary/40 p-5"
          >
            <div className="h-6 w-3/4 rounded-md bg-white/10" />
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, tagIndex) => (
                <div
                  key={tagIndex}
                  className="h-7 w-16 rounded-full bg-white/10"
                />
              ))}
            </div>
            <div className="mt-5 h-4 w-full rounded-md bg-white/10" />
            <div className="mt-2 h-4 w-5/6 rounded-md bg-white/10" />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="h-10 w-24 rounded-lg bg-white/10" />
        <div className="h-10 w-24 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

export default Loading;
