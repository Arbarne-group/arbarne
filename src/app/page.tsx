import Link from "next/link";
import Image from "next/image";
import { Show, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-on-background">
      {/* Top Navigation Bar */}
      <header className="px-6 md:px-10 py-3.5 flex items-center justify-between border-b border-surface-variant bg-surface sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={240}
            height={60}
            className="h-12 md:h-14 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            Contact
          </Link>
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

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/20 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-sm fill">eco</span>
            Next-Generation Agricultural Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.15] mb-6">
            Cultivating the Future of{" "}
            <span className="text-primary underline decoration-primary/30 decoration-wavy">
              African Agriculture
            </span>
          </h1>

          <p className="text-base md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Empower your farm with standard 8-pillar maturity diagnostics, precision capability
            roadmaps, and dedicated market connections designed for sustainable agricultural transformation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="px-8 py-3.5 text-sm md:text-base font-semibold bg-primary hover:bg-primary/90 text-on-primary rounded-xl shadow-md btn-shadow hover-lift flex items-center gap-2 transition-all"
              >
                <span>Start Farm Assessment</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-3.5 text-sm md:text-base font-semibold bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-xl shadow-xs hover-lift transition-all flex items-center gap-2"
              >
                <span>Sign In to Account</span>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 text-sm md:text-base font-semibold bg-primary hover:bg-primary/90 text-on-primary rounded-xl shadow-md btn-shadow hover-lift flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-lg">agriculture</span>
                <span>Go to My Farm Radar</span>
              </Link>
              <Link
                href="/assessment"
                className="px-8 py-3.5 text-sm md:text-base font-semibold bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-xl shadow-xs hover-lift transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-primary text-lg">fact_check</span>
                <span>Assessment Hub</span>
              </Link>
            </Show>
          </div>

          {/* Core Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto text-left">
            <div className="p-6 rounded-2xl bg-surface border border-surface-variant/60 shadow-xs hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[22px]">radar</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">
                8-Pillar FFMI Diagnostic
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Benchmark capability across Agronomy, Water, Soil, Energy, Labor, Markets, and Financial Systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-surface-variant/60 shadow-xs hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[22px]">route</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">
                Tailored Transition Plans
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Clear recommendations and priority steps to advance your operations from Basic to Established commercial readiness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-surface-variant/60 shadow-xs hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[22px]">storefront</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">
                Capital &amp; Market Linkages
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Unlock matching grants, ag-tech equipment financing, and commercial buyer opportunities for your farm.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Production Footer */}
      <footer className="py-8 px-6 border-t border-surface-variant bg-surface text-center text-xs text-on-surface-variant">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Future Farms. Cultivating the Future of African Agriculture.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors">
              Help Center
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
