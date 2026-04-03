function Loading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="rounded-2xl border border-white/5 bg-primary/40 p-6">
        <div className="h-8 w-3/4 rounded-md bg-white/10" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-7 w-16 rounded-full bg-white/10" />
          ))}
        </div>
        <div className="mt-6 h-4 w-full rounded-md bg-white/10" />
        <div className="mt-2 h-4 w-11/12 rounded-md bg-white/10" />
        <div className="mt-2 h-4 w-10/12 rounded-md bg-white/10" />
      </div>

      <div className="mt-8">
        <div className="h-6 w-32 rounded-md bg-white/10" />
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/5 bg-primary/40 p-5"
            >
              <div className="h-5 w-1/2 rounded-md bg-white/10" />
              <div className="mt-4 h-4 w-full rounded-md bg-white/10" />
              <div className="mt-2 h-4 w-4/5 rounded-md bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;
