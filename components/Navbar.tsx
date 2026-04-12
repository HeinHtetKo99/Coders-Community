import logo from "../public/logo.jpg";
import Image from "next/image";
import profile from "../public/profile.jpg";
import SearchInput from "./SearchInput";
import Link from "next/link";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-secondary/80 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between py-3 px-4 sm:py-5 sm:px-10 items-center max-w-375 mx-auto w-full gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-main shadow-lg shadow-main/20 transition-transform group-hover:scale-105">
            <Image src={logo} alt="logo" className="object-cover" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">
            Coders <span className="text-main">Community</span>
          </h1>
        </div>

        <div className="flex-1 max-w-150 w-full">
          <SearchInput />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/login"
            className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 hover:border-main transition-all cursor-pointer"
          >
            <Image src={profile} alt="profile" className="object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
