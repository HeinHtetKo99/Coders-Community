"use client";
import Button from "@/components/Button";
import Routes from "@/routes";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast, Bounce } from "react-toastify";

function AuthForm() {
  const oauthClient = async (method: string) => {
    try {
      await signIn(method, {
        redirectTo: Routes.Home,
      });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  };
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <Button
        variant="outlined"
        icon={<FcGoogle className="text-xl" />}
        className="border-white/10 hover:border-main/50 w-full py-2.5 transition-all duration-300"
        onClick={() => oauthClient("google")}
      >
        Google
      </Button>
      <Button
        variant="outlined"
        icon={<FaGithub className="text-xl text-white" />}
        className="border-white/10 hover:border-main/50 w-full py-2.5 transition-all duration-300"
        onClick={() => oauthClient("github")}
      >
        Github
      </Button>
    </div>
  );
}

export default AuthForm;
