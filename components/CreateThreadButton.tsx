"use client";

import Routes from "@/routes";
import React from "react";
import { Bounce, toast } from "react-toastify";
import ButtonLink from "./ButtonLink";

function CreateThreadButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <ButtonLink
        href={Routes.CreateThreads}
        className="px-4 py-2.5 h-fit text-sm font-medium w-full sm:w-auto text-center"
      >
        Create a New Thread
      </ButtonLink>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        toast.error("You need to sign in first to create a question.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
      }}
      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm bg-main text-white hover:bg-main/90 h-fit w-full sm:w-auto text-center"
    >
      <span>Create a New Thread</span>
    </button>
  );
}

export default CreateThreadButton;
