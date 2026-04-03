import { signInWithCredentials } from "@/lib/actions/signInWithCredentials.action";
import AuthenticationForm from "../components/AuthenticationForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Routes from "@/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(Routes.Home);
  }

  return <AuthenticationForm type="login" action={signInWithCredentials} />;
}

export default LoginPage;
