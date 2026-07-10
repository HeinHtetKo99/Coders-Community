import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import { authFeatures } from "@/constant/authFeatures";
import Routes from "@/routes";
import { ArrowRight } from "lucide-react";

interface AuthShowcaseProps {
  type: "login" | "register";
}

function AuthShowcase({ type }: AuthShowcaseProps) {
  const isRegister = type === "register";

  return (
    <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between overflow-hidden bg-primary/40 border-r border-white/5 p-10 xl:p-14">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-main/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-main/10 blur-[100px]" />

      {/* Floating code decoration */}
      <div className="pointer-events-none absolute top-1/3 right-8 opacity-[0.07] font-mono text-xs text-white leading-relaxed select-none">
        <pre>{`const community = {
  learn: true,
  build: true,
  share: true,
};`}</pre>
      </div>

      <div className="relative z-10">
        <Link href={Routes.Home} className="group flex items-center gap-3 w-fit">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-secondary/60 p-2 shadow-lg backdrop-blur-md transition-transform group-hover:scale-105">
            <Image
              src={logo}
              alt="Coders Community"
              width={36}
              height={36}
              className="rounded-lg object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              Coders <span className="text-main">Community</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Learn. Build. Share.
            </p>
          </div>
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
        <p className="auth-fade-in-up mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-main">
          Developer Q&A Platform
        </p>

        <h2 className="auth-fade-in-up auth-delay-1 text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
          {isRegister ? (
            <>
              Start your
              <br />
              <span className="bg-gradient-to-r from-main to-cyan-300 bg-clip-text text-transparent">
                coding journey
              </span>
            </>
          ) : (
            <>
              Welcome back,
              <br />
              <span className="bg-gradient-to-r from-main to-cyan-300 bg-clip-text text-transparent">
                developer
              </span>
            </>
          )}
        </h2>

        <p className="auth-fade-in-up auth-delay-2 mt-5 max-w-md text-base leading-relaxed text-gray-400">
          {isRegister
            ? "Join thousands of developers asking questions, sharing knowledge, and growing their reputation in a supportive community."
            : "Pick up where you left off — answer questions, earn reputation, and stay connected with the dev community."}
        </p>

        <div className="auth-fade-in-up auth-delay-3 mt-10 flex flex-col gap-3">
          {authFeatures.slice(0, 3).map((feature) => (
            <div
              key={feature.title}
              className={`rounded-xl border border-white/5 border-l-2 ${feature.accent} bg-secondary/30 p-4 backdrop-blur-sm transition-colors hover:bg-secondary/50`}
            >
              <span className="font-mono text-[10px] font-medium text-gray-600">
                {feature.index}
              </span>
              <p className="mt-1 font-semibold text-white text-sm">
                {feature.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} Coders Community
        </p>
        <Link
          href={Routes.Home}
          className="group flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-main"
        >
          Browse without signing in
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default AuthShowcase;
