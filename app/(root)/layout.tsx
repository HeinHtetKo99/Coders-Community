import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import RightSidebarSkeleton from "@/components/RightSidebarSkeleton";
import React, { Suspense } from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col xl:flex-row min-h-[calc(100vh-5rem)] max-w-375 mx-auto gap-4 md:gap-8 xl:gap-12 px-4 sm:px-6 xl:px-10">
        <aside className="sticky top-14 z-40 w-[calc(100%+2rem)] shrink-0 -mx-4 border-b border-white/10 bg-secondary/95 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-secondary/80 sm:top-16 sm:w-[calc(100%+3rem)] sm:-mx-6 sm:px-6 xl:top-20 xl:mx-0 xl:h-[calc(100vh-5rem)] xl:w-70 xl:overflow-y-auto xl:border-none xl:bg-transparent xl:px-0 xl:py-8 xl:backdrop-blur-none hide-scrollbar">
          <LeftSidebar />
        </aside>

        <main className="flex-1 min-w-0 py-4 xl:py-8 w-full">
          <div className="max-w-200 mx-auto">{children}</div>
        </main>

        <aside className="w-full xl:w-87.5 shrink-0 xl:sticky top-20 xl:h-[calc(100vh-5rem)] py-8 overflow-y-auto hide-scrollbar border-t xl:border-t-0 xl:border-l border-white/5 xl:pl-8 mt-4 xl:mt-0">
          <Suspense fallback={<RightSidebarSkeleton />}>
            <RightSidebar />
          </Suspense>
        </aside>
      </div>
    </>
  );
}

export default layout;
