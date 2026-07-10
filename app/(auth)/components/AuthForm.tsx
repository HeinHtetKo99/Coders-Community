"use client";
import Button from "@/components/Button";
import Routes from "@/routes";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function AuthForm() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const oauthClient = async (method: string) => {
    setLoadingProvider(method);
    try {
      await signIn(method, {
        redirectTo: Routes.Home,
      });
    } catch (e) {
      setLoadingProvider(null);
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
    <div className="flex flex-col gap-3">
      <Button
        variant="outlined"
        icon={
          loadingProvider === "google" ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <FcGoogle className="text-xl" />
          )
        }
        className="w-full border-white/10 bg-white/[0.03] py-3 transition-all duration-300 hover:border-main/40 hover:bg-white/[0.06] disabled:opacity-60"
        onClick={() => oauthClient("google")}
        disabled={loadingProvider !== null}
      >
        Continue with Google
      </Button>
      <Button
        variant="outlined"
        icon={
          loadingProvider === "github" ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <FaGithub className="text-xl text-white" />
          )
        }
        className="w-full border-white/10 bg-white/[0.03] py-3 transition-all duration-300 hover:border-main/40 hover:bg-white/[0.06] disabled:opacity-60"
        onClick={() => oauthClient("github")}
        disabled={loadingProvider !== null}
      >
        Continue with GitHub
      </Button>
    </div>
  );
}

export default AuthForm;
