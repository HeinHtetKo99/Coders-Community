import { auth } from "@/auth";
import Routes from "@/routes";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import MobileNavBar from "./MobileNavBar";
import SidebarNavLinks from "./SidebarNavLinks";
import LogoutButton from "./LogoutButton";

async function LeftSidebar() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <div className="w-full xl:hidden">
        <MobileNavBar isAuthenticated={!!user} />
      </div>

      <div className="hidden h-full w-full flex-col gap-3 xl:flex">
        <SidebarNavLinks isAuthenticated={!!user} />

        {user ? (
          <div className="mt-auto shrink-0">
            <LogoutButton
              showLabel
              className="flex w-full items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white"
              iconClassName="text-2xl"
              labelClassName="text-lg"
            />
          </div>
        ) : (
          <div className="mt-auto shrink-0">
            <Link
              href={Routes.Login}
              className="flex items-center gap-4 rounded-2xl border border-main/20 bg-main/10 px-6 py-4 font-semibold text-main transition-all hover:bg-main hover:text-white"
            >
              <FiLogIn className="text-2xl" />
              <span className="text-lg">Login</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default LeftSidebar;
