function UserProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-4xl mx-auto animate-pulse">
      <div className="bg-primary/40 rounded-2xl border border-white/5 overflow-hidden">
        <div className="h-32 sm:h-48 w-full bg-white/10 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10">
            <div className="rounded-full p-1.5 bg-secondary border-2 border-white/10">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/15" />
            </div>
          </div>
        </div>

        <div className="pt-16 sm:pt-20 px-6 sm:px-10 pb-8">
          <div className="h-8 w-56 rounded-md bg-white/10" />
          <div className="mt-3 h-5 w-40 rounded-md bg-white/10" />
          <div className="mt-6 h-4 w-full max-w-2xl rounded-md bg-white/10" />
          <div className="mt-3 h-4 w-2/3 max-w-xl rounded-md bg-white/10" />
          <div className="mt-6 h-4 w-44 rounded-md bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary/40 rounded-2xl border border-white/5 p-6">
          <div className="mx-auto h-12 w-12 rounded-xl bg-white/10" />
          <div className="mt-4 mx-auto h-8 w-24 rounded-md bg-white/10" />
          <div className="mt-2 mx-auto h-4 w-20 rounded-md bg-white/10" />
        </div>

        <div className="bg-primary/40 rounded-2xl border border-white/5 p-6">
          <div className="mx-auto h-8 w-20 rounded-md bg-white/10" />
          <div className="mt-2 mx-auto h-4 w-28 rounded-md bg-white/10" />
        </div>

        <div className="bg-primary/40 rounded-2xl border border-white/5 p-6">
          <div className="mx-auto h-8 w-20 rounded-md bg-white/10" />
          <div className="mt-2 mx-auto h-4 w-24 rounded-md bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default UserProfileSkeleton;
