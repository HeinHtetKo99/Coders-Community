import React from "react";
import QuestionForm from "../components/QuestionForm";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Routes from "@/routes";

export const metadata: Metadata = {
  title: "Create Thread",
};

async function page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(Routes.Login);
  }
  return (
    <>
      <QuestionForm />
    </>
  );
}

export default page;
