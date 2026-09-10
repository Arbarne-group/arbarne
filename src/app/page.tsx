import Link from "next/link";
import Image from "next/image";
import { Show, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-on-background">
      {/* Top Navigation Bar */}
      <header className="px-4 sm:px-6 md:px-10 py-3 sm:py-3.5 flex items-center justify-between border-b border-surface-variant bg-surface sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={240}
            height={60}
            className="h-9 sm:h-12 md:h-14 max-w-[140px] sm:max-w-[180px] md:max-w-none w-auto object-contain"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center">
          <a
            href="https://www.futurefarms.africa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 transition-all"
          >
            <span>Future Farms Main Site</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-xs md:text-sm font-semibold text-on-surface hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold bg-primary hover:bg-primary/90 text-on-primary rounded-xl shadow-sm hover-lift transition-all"
            >
              Get Started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs md:text-sm font-semibold bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">agriculture</span>
              <span>Dashboard</span>
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-4 md:py-6 w-full max-w-7xl mx-auto">
        {/* Rounded Cinematic Hero Banner */}
        <div className="relative w-full rounded-2xl md:rounded-[32px] overflow-hidden min-h-[500px] md:min-h-[560px] lg:min-h-[600px] flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-16 shadow-2xl border border-black/10">
          {/* Background Aerial Drone Landscape Image */}
          <Image
            src="/images/hero-farm-drone.jpg"
            alt="Facilitating Transition to Future-Ready Farm Systems with Precision Drone Agriculture"
            fill
            priority
            className="object-cover object-center z-0"
          />

          {/* Contrast Overlay for Crisp Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75 z-10" />

          {/* Centered Hero Content */}
          <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif font-bold text-white tracking-tight leading-[1.2] mb-5 drop-shadow-md">
              Facilitating the Transition to{" "}
              <span className="text-emerald-400 font-serif font-bold">
                Future-Ready
              </span>
              <br className="hidden sm:inline" />{" "}
              Farm Systems
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl sm:max-w-3xl mx-auto mb-8 font-normal leading-relaxed drop-shadow">
              Our Mission is to lead the transition of African agriculture from traditional, inefficient systems to future-ready, productive, and profitable farm enterprises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Show when="signed-out">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto justify-center px-7 py-3.5 text-sm md:text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Start Farm Assessment</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto justify-center px-7 py-3.5 text-sm md:text-base font-semibold bg-black/35 hover:bg-black/50 text-white border border-white/40 backdrop-blur-md rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Sign In to Account</span>
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto justify-center px-7 py-3.5 text-sm md:text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Go to My Farm Radar</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <Link
                  href="/assessment"
                  className="w-full sm:w-auto justify-center px-7 py-3.5 text-sm md:text-base font-semibold bg-black/35 hover:bg-black/50 text-white border border-white/40 backdrop-blur-md rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">fact_check</span>
                  <span>Assessment Hub</span>
                </Link>
              </Show>
            </div>
          </div>
        </div>

        {/* Core Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8 max-w-6xl w-full text-left">
          <div className="group relative p-7 rounded-2xl bg-surface border border-surface-variant/80 shadow-xs hover:shadow-lg hover:-translate-y-1.5 hover:border-outline-variant/60 transition-all duration-300 overflow-hidden cursor-default">
            {/* Subtle card shimmer sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <h3 className="text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-200 mb-2.5">
              8-Pillar FFMI Diagnostic
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Benchmark capability across Agronomy, Water, Soil, Energy, Labor, Markets, and Financial Systems.
            </p>
          </div>

          <div className="group relative p-7 rounded-2xl bg-surface border border-surface-variant/80 shadow-xs hover:shadow-lg hover:-translate-y-1.5 hover:border-outline-variant/60 transition-all duration-300 overflow-hidden cursor-default">
            {/* Subtle card shimmer sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <h3 className="text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-200 mb-2.5">
              Tailored Transition Plans
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Clear recommendations and priority steps to advance your operations from Basic to Established commercial readiness.
            </p>
          </div>

          <div className="group relative p-7 rounded-2xl bg-surface border border-surface-variant/80 shadow-xs hover:shadow-lg hover:-translate-y-1.5 hover:border-outline-variant/60 transition-all duration-300 overflow-hidden cursor-default">
            {/* Subtle card shimmer sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <h3 className="text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-200 mb-2.5">
              Capital &amp; Market Linkages
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Unlock matching grants, ag-tech equipment financing, and commercial buyer opportunities for your farm.
            </p>
          </div>
        </div>
        </main>

      {/* Production Footer */}
      <footer className="py-8 px-6 border-t border-surface-variant bg-surface text-center text-xs text-on-surface-variant">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Future Farms. Cultivating the Future of African Agriculture.</p>
          <div className="flex items-center gap-6 font-medium">
            <a
              href="https://www.futurefarms.africa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <span>Future Farms Main Site</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
