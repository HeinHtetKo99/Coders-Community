import { auth, signOut } from "@/auth";
import Routes from "@/routes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import SidebarNavLinks from "./SidebarNavLinks";
import { cn } from "@/lib/utils";

async function LeftSidebar() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex h-full w-full flex-row items-stretch gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-0.5 xl:flex-col xl:gap-3 xl:overflow-visible xl:pb-0">
      <SidebarNavLinks isAuthenticated={!!user} />

      {user ? (
        <div className="ml-auto shrink-0 snap-end xl:ml-0 xl:mt-auto">
          <form
            action={async () => {
              "use server";
              await signOut({ redirect: false });
              return redirect(Routes.Login);
            }}
          >
            <button
              type="submit"
              title="Logout"
              aria-label="Logout"
              className={cn(
                "flex cursor-pointer items-center justify-center gap-1 rounded-xl font-semibold transition-all xl:gap-4 xl:rounded-2xl",
                "h-14 w-14 xl:h-auto xl:w-full xl:px-6 xl:py-4",
                "border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
              )}
            >
              <FiLogOut className="text-[1.35rem] xl:text-2xl" />
              <span className="text-[10px] font-medium leading-none xl:text-lg">
                Logout
              </span>
            </button>
          </form>
        </div>
      ) : (
        <div className="ml-auto shrink-0 snap-end xl:ml-0 xl:mt-auto">
          <Link
            href={Routes.Login}
            title="Login"
            aria-label="Login"
            className={cn(
              "flex items-center justify-center gap-1 rounded-xl font-semibold transition-all xl:gap-4 xl:rounded-2xl",
              "h-14 w-14 xl:h-auto xl:w-full xl:px-6 xl:py-4",
              "border border-main/25 bg-main/10 text-main hover:bg-main hover:text-white"
            )}
          >
            <FiLogIn className="text-[1.35rem] xl:text-2xl" />
            <span className="text-[10px] font-medium leading-none xl:text-lg">
              Login
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LeftSidebar;
