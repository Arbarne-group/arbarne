import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-surface-variant bg-surface">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl fill">
            agriculture
          </span>
          <span className="font-bold text-primary text-2xl tracking-tight">
            Future Farms
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-on-surface hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90 text-on-primary rounded-xl shadow-sm hover-lift transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container/15 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="material-symbols-outlined text-sm fill">eco</span>
            Next-Generation Agricultural Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-on-surface tracking-tight leading-tight mb-6">
            Cultivating the Future of{" "}
            <span className="text-primary underline decoration-primary/40">
              African Agriculture
            </span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Empower your farming journey with data-driven maturity assessments,
            precision recommendations, and tools designed for sustainable growth across Africa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 text-base font-semibold bg-primary hover:bg-primary/90 text-on-primary rounded-xl shadow-md btn-shadow hover-lift flex items-center gap-2 transition-all"
            >
              Start Free Onboarding
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 text-base font-semibold bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant rounded-xl shadow-sm hover-lift transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-primary fill">insights</span>
              View Live Demo Dashboard
            </Link>
          </div>

          {/* Quick links to all screens */}
          <div className="mt-14 pt-8 border-t border-surface-variant max-w-4xl mx-auto">
            <p className="text-xs uppercase font-semibold text-on-surface-variant/70 tracking-wider mb-4">
              Explore All 17 Application Pages &amp; Tabs
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              <Link
                href="/signup"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                1. Sign Up
              </Link>
              <Link
                href="/login"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                2. Sign In
              </Link>
              <Link
                href="/onboarding"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                3. Onboarding Hub
              </Link>
              <Link
                href="/onboarding/step-1"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                4. Farmer Profile
              </Link>
              <Link
                href="/onboarding/step-2"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                5. Management
              </Link>
              <Link
                href="/onboarding/step-3"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                6. Operating Style
              </Link>
              <Link
                href="/onboarding/step-4"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                7. Digital Platforms
              </Link>
              <Link
                href="/onboarding/step-5"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                8. Aspirations
              </Link>
              <Link
                href="/assessment"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                9. Assessment Hub
              </Link>
              <Link
                href="/pricing"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                10. Pricing
              </Link>
              <Link
                href="/checkout"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                11. M-Pesa Checkout
              </Link>
              <Link
                href="/dashboard"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                12. My Farm Radar
              </Link>
              <Link
                href="/learning"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                13. Digital Learning
              </Link>
              <Link
                href="/opportunities"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                14. Opportunity Desk
              </Link>
              <Link
                href="/service-desk"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                15. Service Desk
              </Link>
              <Link
                href="/help"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                16. Help Center
              </Link>
              <Link
                href="/contact"
                className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all text-center font-medium shadow-xs"
              >
                17. Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-surface-variant bg-surface text-center text-xs text-on-surface-variant">
        &copy; {new Date().getFullYear()} Future Farms Ltd. Empowering sustainable agriculture in Africa.
      </footer>
    </div>
  );
}
