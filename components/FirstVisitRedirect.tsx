"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { hasVisitedBefore } from "@/lib/firstVisit";
import Routes from "@/routes";

const SKIP_PATHS = [
  Routes.Welcome,
  Routes.Login,
  Routes.Register,
];

function FirstVisitRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") return;
    if (SKIP_PATHS.some((path) => pathname.startsWith(path))) return;
    if (hasVisitedBefore()) return;

    router.replace(Routes.Welcome);
  }, [pathname, router, status]);

  return null;
}

export default FirstVisitRedirect;
