"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthForm from "../components/AuthForm";
import AuthShowcase from "../components/AuthShowcase";
import Routes from "@/routes";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  AtSign,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";

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

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
      {children}
    </span>
  );
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setIsLoading(true);
    try {
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
            setErrors({ password: [result.message] });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "bg-secondary/50 border-white/8 focus:border-main/50 pl-11 pr-4 py-3.5 transition-all placeholder:text-gray-600";

  return (
    <div className="min-h-screen w-full flex bg-secondary relative overflow-hidden">
      <AuthShowcase type={type} />

      {/* Mobile background glow */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-main/10 blur-[120px] lg:hidden" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-main/10 blur-[120px] lg:hidden" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        {/* Mobile header */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <Link href={Routes.Home} className="mb-4 flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-primary/40 p-2 backdrop-blur-md">
              <Image
                src={logo}
                alt="Coders Community"
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight text-center">
            {isRegister ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="mt-1.5 text-center text-sm text-gray-500">
            {isRegister
              ? "Join the community today"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Desktop form header */}
          <div className="auth-fade-in-up mb-8 hidden lg:block">
            <Link
              href={Routes.Welcome}
              className="group mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-main"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to welcome
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {isRegister ? "Create Account" : "Sign In"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {isRegister
                ? "Fill in your details to get started"
                : "Enter your credentials to continue"}
            </p>
          </div>

          <div className="auth-fade-in-up auth-delay-1 rounded-3xl border border-white/8 bg-primary/25 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-gray-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <FieldIcon>
                        <User className="h-4 w-4" />
                      </FieldIcon>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    {errors?.name && (
                      <p className="text-xs text-red-400">{errors.name[0]}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="username" className="text-xs font-medium text-gray-400">
                      Username
                    </label>
                    <div className="relative">
                      <FieldIcon>
                        <AtSign className="h-4 w-4" />
                      </FieldIcon>
                      <Input
                        id="username"
                        placeholder="johndoe"
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    {errors?.username && (
                      <p className="text-xs text-red-400">{errors.username[0]}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-400">
                  Email Address
                </label>
                <div className="relative">
                  <FieldIcon>
                    <Mail className="h-4 w-4" />
                  </FieldIcon>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                {errors?.email && (
                  <p className="text-xs text-red-400">{errors.email[0]}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-400">
                  Password
                </label>
                <div className="relative">
                  <FieldIcon>
                    <Lock className="h-4 w-4" />
                  </FieldIcon>
                  <Input
                    id="password"
                    placeholder={isRegister ? "Min. 8 characters" : "Your password"}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-xs text-red-400">{errors.password[0]}</p>
                )}
              </div>

              <Button
                className="mt-2 w-full py-3.5 text-base font-bold shadow-lg shadow-main/25 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
                icon={
                  isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : undefined
                }
              >
                {isLoading
                  ? isRegister
                    ? "Creating Account..."
                    : "Signing In..."
                  : isRegister
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                or
              </span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            <AuthForm />

            <p className="mt-8 text-center text-sm text-gray-500">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                href={isRegister ? Routes.Login : Routes.Register}
                className="font-semibold text-main transition-colors hover:text-main/80 hover:underline"
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
