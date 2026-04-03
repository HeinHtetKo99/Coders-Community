import { auth, signOut } from "@/auth";
import Routes from "@/routes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import SidebarNavLinks from "./SidebarNavLinks";

async function LeftSidebar() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex flex-row xl:flex-col gap-3 xl:gap-4 h-full w-max xl:w-full min-w-full pb-2 xl:pb-0">
      <SidebarNavLinks isAuthenticated={!!user} />

      {user ? (
        <div className="xl:mt-auto shrink-0">
          <form
            action={async () => {
              "use server";
              await signOut({ redirect: false });
              return redirect(Routes.Login);
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 xl:gap-4 px-4 xl:px-6 py-3 xl:py-4 rounded-2xl bg-red-500/10 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all border border-red-500/20 w-full cursor-pointer h-full"
            >
              <FiLogOut className="text-xl xl:text-2xl" />
              <span className="max-xl:hidden text-lg">Logout</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="xl:mt-auto shrink-0">
          <Link
            href={Routes.Login}
            className="flex items-center gap-3 xl:gap-4 px-4 xl:px-6 py-3 xl:py-4 rounded-2xl bg-main/10 text-main font-semibold hover:bg-main hover:text-white transition-all border border-main/20 w-full h-full"
          >
            <FiLogIn className="text-xl xl:text-2xl" />
            <span className="max-xl:hidden text-lg">Login</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LeftSidebar;
