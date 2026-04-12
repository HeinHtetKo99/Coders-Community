import React from "react";
import QuestionForm from "../components/QuestionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Thread",
};

function page() {
  return (
    <>
      <QuestionForm />
    </>
  );
}

export default page;
