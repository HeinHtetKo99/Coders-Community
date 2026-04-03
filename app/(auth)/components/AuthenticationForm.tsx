"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthForm from "../components/AuthForm";
import Routes from "@/routes";
import { useRouter } from "next/navigation";

interface AuthenticationFormProps {
  type: "login" | "register";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  action: Function;
}
interface FormData {
  name?: string;
  email: string;
  password: string;
  username?: string;
}

interface ErrorType {
  name?: string[];
  email?: string[];
  password?: string[];
  username?: string[];
}
function AuthenticationForm({ type, action }: AuthenticationFormProps) {
  const isRegister = type === "register";
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<ErrorType | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    const result = await action(formData);
    if (result.success) {
      router.push(Routes.Home);
    } else {
      if (result.details) {
        setErrors(result.details as ErrorType);
      } else if (result.message) {
        if (result.message.includes("Email")) {
          setErrors({ email: [result.message] });
        } else if (result.message.includes("Username")) {
          setErrors({ username: [result.message] });
        } else {
          setErrors({
            password: [result.message],
          });
        }
      }
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary relative overflow-hidden px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-main/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-main/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/40 rounded-2xl flex items-center justify-center p-3 backdrop-blur-md border border-white/5 shadow-2xl mb-6 transition-transform hover:scale-105">
            <Image
              src={logo}
              alt="Coders Community"
              width={60}
              height={60}
              className="rounded object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight text-center">
            {isRegister ? "Create an Account" : "Sign in to Coders Community"}
          </h1>
          <p className="text-gray-400 mt-2 text-center text-sm">
            {isRegister
              ? "Join the community and start your coding journey!"
              : "Welcome back! Please enter your details."}
          </p>
        </div>

        <div className="bg-primary/30 backdrop-blur-xl border border-white/5 p-8 rounded-4xl shadow-2xl shadow-black/50">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-gray-300">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-secondary/50 border-white/5 focus:border-main/50 transition-all py-3"
                  />
                  {errors?.name && (
                    <p className="text-red-500 text-sm">{errors.name[0]}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="username" className="text-gray-300">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Your Username"
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="bg-secondary/50 border-white/5 focus:border-main/50 transition-all py-3"
                  />
                  {errors?.username && (
                    <p className="text-red-500 text-sm">{errors.username[0]}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-gray-300">
                Email Address
              </label>
              <Input
                id="email"
                placeholder="Enter your email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-secondary/50 border-white/5 focus:border-main/50 transition-all py-3"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm">{errors.email[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-gray-300">
                Password
              </label>
              <Input
                id="password"
                placeholder={
                  isRegister ? "Create a password" : "Enter your password"
                }
                type="password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="bg-secondary/50 border-white/5 focus:border-main/50 transition-all py-3"
              />
              {errors?.password && (
                <p className="text-red-500 text-sm">{errors.password[0]}</p>
              )}
            </div>

            <Button
              className="w-full py-3.5 mt-2 shadow-lg shadow-main/20 font-bold text-base"
              type="submit"
            >
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <AuthForm />

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                href={isRegister ? Routes.Login : Routes.Register}
                className="text-main font-bold hover:underline transition-all ml-1"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationForm;
