import React from "react";
import Image from "next/image";
import Logo from "@/public/profile.jpg";
import Link from "next/link";
import Routes from "@/routes";

function UserInfoCard({
  name,
  image,
  id,
  reputation,
}: {
  name: string;
  image?: string;
  id?: string;
  reputation?: number;
}) {
  return (
    <Link
      href={Routes.userProfile(id || "")}
      className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-primary/30 p-8 hover:border-main/30 hover:bg-primary/40 transition-all duration-300 w-full"
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 group-hover:border-main/50 transition-colors">
        <Image
          src={image ? image : Logo}
          alt={name || "User"}
          width={96}
          height={96}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 96px"
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold text-white group-hover:text-main transition-colors line-clamp-1">
          {name || "Unknown"}
        </h3>
        <p className="mt-1 text-sm text-gray-300">
          Reputation: {Number(reputation || 0)}
        </p>
      </div>
    </Link>
  );
}

export default UserInfoCard;
