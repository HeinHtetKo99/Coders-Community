"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosSearch, IoIosClose } from "react-icons/io";
import { HiOutlinePlus } from "react-icons/hi";
import { FiLogIn } from "react-icons/fi";
import logo from "../public/logo.jpg";
import profile from "../public/profile.jpg";
import SearchInput from "./SearchInput";
import LogoutButton from "./LogoutButton";
import Routes from "@/routes";

type NavbarUser = {
  id: string;
  name?: string | null;
  username?: string | null;
  image: string;
};

type NavbarClientProps = {
  user: NavbarUser | null;
  isDataUrl: boolean;
};

function subscribeToDesktopMedia(callback: () => void) {
  const mediaQuery = window.matchMedia("(min-width: 768px)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopMediaSnapshot() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function NavbarClient({ user, isDataUrl }: NavbarClientProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopMedia,
    getDesktopMediaSnapshot,
    () => false
  );
  const displayName = user?.name || user?.username || "Profile";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-secondary/90 backdrop-blur-xl supports-[backdrop-filter]:bg-secondary/75">
      <div className="mx-auto flex w-full max-w-375 items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-10">
        <Link
          href={Routes.Home}
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-main/30 shadow-lg shadow-main/15 transition-transform group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl">
            <Image src={logo} alt="Coders Community logo" className="object-cover" />
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-base font-bold tracking-tight text-white lg:text-lg">
              Coders <span className="text-main">Community</span>
            </p>
            <p className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500 lg:block">
              Learn. Build. Share.
            </p>
          </div>
        </Link>

        {isDesktop ? (
          <div className="min-w-0 flex-1">
            <SearchInput />
          </div>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((open) => !open)}
            aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={isMobileSearchOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-primary/50 text-gray-300 transition-colors hover:border-main/40 hover:text-main md:hidden"
          >
            {isMobileSearchOpen ? (
              <IoIosClose className="text-2xl" />
            ) : (
              <IoIosSearch className="text-xl" />
            )}
          </button>

          {user ? (
            <>
              <Link
                href={Routes.CreateThreads}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-main px-3 text-sm font-semibold text-white shadow-lg shadow-main/20 transition-colors hover:bg-main/90 sm:px-4"
              >
                <HiOutlinePlus className="text-lg sm:hidden" />
                <span className="hidden sm:inline">Ask Question</span>
              </Link>

              <LogoutButton
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500 hover:text-white sm:px-4"
                iconClassName="text-base sm:text-lg"
                showLabel
                labelClassName="hidden sm:inline"
              />
            </>
          ) : (
            <Link
              href={Routes.Login}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-main/30 bg-main/10 px-3 text-sm font-semibold text-main transition-colors hover:bg-main hover:text-white sm:px-4"
            >
              <FiLogIn className="text-base sm:hidden" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          <Link
            href={user ? Routes.userProfile(user.id) : Routes.Login}
            className="group/profile flex items-center gap-2.5 rounded-xl border border-white/10 bg-primary/30 p-1 pr-2 transition-all hover:border-main/40 hover:bg-primary/50 sm:pr-3"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg ring-2 ring-white/10 transition-all group-hover/profile:ring-main/50 sm:h-9 sm:w-9 sm:rounded-xl">
              <Image
                src={user?.image || profile}
                alt={displayName}
                className="object-cover"
                width={36}
                height={36}
                unoptimized={isDataUrl}
              />
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-gray-400">
                {user ? "View profile" : "Join community"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {!isDesktop && isMobileSearchOpen ? (
        <div className="border-t border-white/5 bg-secondary/95 px-3 py-3 md:hidden">
          <SearchInput compact />
        </div>
      ) : null}
    </header>
  );
}

export default NavbarClient;
