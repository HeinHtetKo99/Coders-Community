import WelcomeClient from "../components/WelcomeClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Routes from "@/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description:
    "Welcome to Coders Community — a developer Q&A platform to learn, build, and share.",
};

async function WelcomePage() {
  const session = await auth();
  if (session?.user) {
    redirect(Routes.Home);
  }

  return <WelcomeClient />;
}

export default WelcomePage;
