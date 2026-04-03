import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaMapMarkerAlt, FaLink, FaCalendarAlt } from "react-icons/fa";
import { BsTrophy } from "react-icons/bs";
import { getUser } from "@/lib/actions/getUser.action";

export default async function UserProfile({ userId }: { userId: string }) {
  const { data, success } = await getUser({ userId });
  if (!data && !success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">User not found</h3>
        <p className="text-gray-400">
          The user you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  const { user, totalAnswers, totalQuestions } = data || {};
  const joinDate = (user as any)?.createdAt
    ? new Date((user as any)?.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";
  const displayName = String(user?.name || "")
    .replace(/https?:\/\/[^\s]+/g, "")
    .trim();

  return (
    <div className="flex flex-col gap-6 py-8 w-full max-w-full lg:max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-primary/40 rounded-2xl border border-white/5 overflow-hidden">
        <div className="h-32 sm:h-48 w-full bg-linear-to-r from-main/40 to-main/10 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10">
            <div className="rounded-full p-1.5 bg-secondary border-2 border-main/20">
              <Image
                src={user?.image || "/profile.jpg"}
                alt={user?.name || ""}
                width={120}
                height={120}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="pt-16 sm:pt-20 px-6 sm:px-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {displayName || user?.name || ""}
              </h1>
              <p className="text-main font-medium mt-1">
                @{user?.username || ""}
              </p>
            </div>
          </div>

          {user?.bio && (
            <p className="mt-6 text-gray-300 max-w-2xl leading-relaxed">
              {user?.bio || ""}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-gray-400">
            {user?.location && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-main/70 w-4 h-4" />
                <span>{user?.location || "Unknown"}</span>
              </div>
            )}
            {user?.portfolio && (
              <div className="flex items-center gap-2">
                <FaLink className="text-main/70 w-4 h-4" />
                <Link
                  href={
                    user?.portfolio?.startsWith("http")
                      ? user?.portfolio
                      : `https://${user?.portfolio}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-main transition-colors"
                >
                  {user?.portfolio || ""}
                </Link>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-main/70 w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary/40 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-xl bg-main/10 mb-4">
            <BsTrophy className="w-6 h-6 text-main" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {user?.reputation || 0}
          </h3>
          <p className="text-gray-400 text-sm mt-1">Reputation</p>
        </div>

        <div className="bg-primary/40 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-3xl font-bold text-white">{totalQuestions}</h3>
          <p className="text-gray-400 text-sm mt-1">Questions Asked</p>
        </div>

        <div className="bg-primary/40 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-3xl font-bold text-white">{totalAnswers}</h3>
          <p className="text-gray-400 text-sm mt-1">Answers Given</p>
        </div>
      </div>
    </div>
  );
}
