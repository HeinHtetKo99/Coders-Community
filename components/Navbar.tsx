import profile from "../public/profile.jpg";
import { auth } from "@/auth";
import { getUserNavData } from "@/lib/actions/getUser.action";
import NavbarClient from "./NavbarClient";

async function Navbar() {
  const session = await auth();
  const user = session?.user;
  const navbarUserId = String(user?.id || "");
  const { data: navbarUserData } = navbarUserId
    ? await getUserNavData({ userId: navbarUserId })
    : { data: undefined };
  const avatarSrc = navbarUserData?.image || user?.image || profile;
  const isDataUrl =
    typeof avatarSrc === "string" && avatarSrc.startsWith("data:");

  return (
    <NavbarClient
      user={
        user?.id
          ? {
              id: String(user.id),
              name: navbarUserData?.name || user.name,
              username: navbarUserData?.username,
              image: typeof avatarSrc === "string" ? avatarSrc : profile.src,
            }
          : null
      }
      isDataUrl={isDataUrl}
    />
  );
}

export default Navbar;
