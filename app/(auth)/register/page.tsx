import { signUpWithCredentials } from "@/lib/actions/signUpWithCredentials.action";
import AuthenticationForm from "../components/AuthenticationForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Routes from "@/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect(Routes.Home);
  }

  return <AuthenticationForm type="register" action={signUpWithCredentials} />;
}

export default RegisterPage;
