import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import RightSidebarSkeleton from "@/components/RightSidebarSkeleton";
import React, { Suspense } from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col xl:flex-row min-h-[calc(100vh-6rem)] max-w-375 mx-auto gap-4 md:gap-8 xl:gap-12 px-4 sm:px-6 xl:px-10">
        <aside className="w-full xl:w-70 shrink-0 xl:sticky top-24 xl:h-[calc(100vh-6rem)] py-3 xl:py-8 overflow-x-auto xl:overflow-y-auto hide-scrollbar z-40 bg-secondary/90 xl:bg-transparent backdrop-blur-md xl:backdrop-blur-none border-b border-white/5 xl:border-none sticky top-[72px] sm:top-[88px] xl:top-24">
          <LeftSidebar />
        </aside>

        <main className="flex-1 min-w-0 py-4 xl:py-8 w-full">
          <div className="max-w-200 mx-auto">{children}</div>
        </main>

        <aside className="w-full xl:w-87.5 shrink-0 xl:sticky top-24 xl:h-[calc(100vh-6rem)] py-8 overflow-y-auto hide-scrollbar border-t xl:border-t-0 xl:border-l border-white/5 xl:pl-8 mt-4 xl:mt-0">
          <Suspense fallback={<RightSidebarSkeleton />}>
            <RightSidebar />
          </Suspense>
        </aside>
      </div>
    </>
  );
}

export default layout;
