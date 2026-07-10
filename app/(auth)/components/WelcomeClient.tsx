"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.jpg";
import { authFeatures, welcomeStats } from "@/constant/authFeatures";
import { markAsVisited } from "@/lib/firstVisit";
import Routes from "@/routes";
import { ArrowRight, ChevronRight } from "lucide-react";

function WelcomeClient() {
  const router = useRouter();

  const handleExplore = () => {
    markAsVisited();
    router.push(Routes.Home);
  };

  const handleGetStarted = () => {
    markAsVisited();
    router.push(Routes.Register);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-secondary">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-main/15 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Nav — single auth action */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <Link href={Routes.Home} className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-main/30 bg-primary/60 p-2 shadow-lg shadow-main/10 transition-transform group-hover:scale-105">
            <Image
              src={logo}
              alt="Coders Community"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold text-white">
              Coders <span className="text-main">Community</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Learn. Build. Share.
            </p>
          </div>
        </Link>

        <button
          onClick={() => {
            markAsVisited();
            router.push(Routes.Login);
          }}
          className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-20 sm:px-10 sm:pt-20 lg:px-16 lg:pt-28">
        <p className="auth-fade-in-up mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-main">
          Developer Q&A Platform
        </p>

        <h1 className="auth-fade-in-up auth-delay-1 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
          Where developers{" "}
          <span className="bg-gradient-to-r from-main via-cyan-400 to-main bg-clip-text text-transparent">
            learn, build,
          </span>{" "}
          and share
        </h1>

        <p className="auth-fade-in-up auth-delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          Coders Community is a full-stack Q&A platform for developers. Ask
          questions, post answers, earn reputation, bookmark threads, and get
          AI-assisted drafts — all in one place.
        </p>

        <div className="auth-fade-in-up auth-delay-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            onClick={handleGetStarted}
            className="group flex items-center justify-center gap-2 rounded-2xl bg-main px-8 py-4 text-base font-bold text-white shadow-xl shadow-main/30 transition-all hover:bg-main/90 hover:shadow-main/50"
          >
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={handleExplore}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-gray-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Explore as Guest
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="auth-fade-in-up auth-delay-4 mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {welcomeStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-primary/30 p-5 text-center backdrop-blur-sm"
            >
              <p className="text-2xl font-bold text-main sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 border-t border-white/5 bg-primary/20 px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-main">
              Platform Features
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything you need to grow as a developer
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              From asking your first question to building reputation — we&apos;ve
              got the tools to support your journey.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`auth-fade-in-up auth-delay-${Math.min(i + 1, 6)} group rounded-2xl border border-white/5 border-l-2 ${feature.accent} bg-secondary/40 p-6 backdrop-blur-sm transition-all hover:bg-secondary/60`}
              >
                <span className="font-mono text-xs font-medium text-gray-600">
                  {feature.index}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-xs text-gray-600 sm:px-10">
        © {new Date().getFullYear()} Coders Community — Built for developers, by
        developers.
      </footer>
    </div>
  );
}

export default WelcomeClient;
