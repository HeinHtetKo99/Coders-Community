function Loading() {
  return (
    <div className="flex flex-col gap-6 py-8 animate-pulse">
      <div className="flex flex-col gap-2 px-2">
        <div className="h-10 w-44 rounded-md bg-white/10" />
        <div className="h-4 w-80 max-w-full rounded-md bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-primary/40 p-5"
          >
            <div className="h-6 w-4/5 rounded-md bg-white/10" />
            <div className="mt-4 h-4 w-full rounded-md bg-white/10" />
            <div className="mt-2 h-4 w-5/6 rounded-md bg-white/10" />
            <div className="mt-6 h-36 w-full rounded-xl bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;
