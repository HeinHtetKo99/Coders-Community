"use server";

import { signOut } from "@/auth";
import Routes from "@/routes";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect(Routes.Login);
}
