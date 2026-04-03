function Loading() {
  return (
    <div className="flex flex-col gap-6 py-8 animate-pulse">
      <div className="px-2">
        <div className="h-10 w-72 max-w-full rounded-md bg-white/10" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-primary/40 p-5"
          >
            <div className="h-6 w-3/4 rounded-md bg-white/10" />
            <div className="mt-4 flex gap-2">
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
    </div>
  );
}

export default Loading;
