"use client";

import Routes from "@/routes";
import React from "react";
import ButtonLink from "./ButtonLink";

function CreateThreadButton() {
  return (
    <ButtonLink
      href={Routes.CreateThreads}
      className="px-4 py-2.5 h-fit text-sm font-medium w-full sm:w-auto text-center"
    >
      Create a New Thread
    </ButtonLink>
  );
}

export default CreateThreadButton;
