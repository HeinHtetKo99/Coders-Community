function AnswerListsSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-7 w-32 bg-white/10 rounded-md" />

      <div className="flex flex-col gap-4">
        {/* Generate 3 skeleton answer cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="group mt-4 first:mt-0 bg-primary/30 p-6 rounded-2xl border border-white/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Author info skeleton */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-4 w-24 bg-white/10 rounded-md" />
                <div className="h-4 w-4 bg-white/10 rounded-full" />
                <div className="h-4 w-32 bg-white/10 rounded-md" />
              </div>

              {/* Actions skeleton */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-24 rounded-lg bg-white/10" />
                  <div className="h-8 w-28 rounded-lg bg-white/10" />
                </div>
                <div className="w-16 h-8 rounded-lg bg-white/10" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="mt-5 border-t border-white/5 pt-5 space-y-3">
              <div className="h-4 w-full bg-white/10 rounded-md" />
              <div className="h-4 w-5/6 bg-white/10 rounded-md" />
              <div className="h-4 w-4/6 bg-white/10 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnswerListsSkeleton;
