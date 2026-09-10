"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error securely for diagnostics
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-on-background">
      {/* Top Navbar */}
      <header className="px-4 sm:px-6 md:px-10 py-3.5 flex items-center justify-between border-b border-surface-variant bg-surface sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={220}
            height={55}
            priority
            unoptimized
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">agriculture</span>
          <span>Go to Dashboard</span>
        </Link>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="max-w-xl w-full text-center bg-surface rounded-3xl p-6 sm:p-10 shadow-ambient border border-outline-variant/50 relative overflow-hidden">
          {/* Subtle Red/Amber Top Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 absolute top-0 left-0" />

          {/* Warning Icon Badge */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-error-container/20 border border-error/30 flex items-center justify-center mb-6 text-error shadow-inner">
            <span className="material-symbols-outlined text-4xl sm:text-5xl animate-pulse">
              warning
            </span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-error-container/30 border border-error/20 text-[11px] font-bold text-error uppercase tracking-widest mb-3">
            Operational Interruption • System Alert
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-3">
            Temporary Farm System Hitch
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed mb-6">
            An unexpected error occurred while processing this farm request. Your underlying data
            remains safe in your registry.
          </p>

          {/* Error Digest Badge (if present) */}
          {error?.digest && (
            <div className="mb-6 p-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-[11px] font-mono text-on-surface-variant break-all max-w-xs mx-auto">
              Ref ID: <span className="text-on-surface font-semibold">{error.digest}</span>
            </div>
          )}

          {/* Action Navigation Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Try Again</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Farm Dashboard</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Home</span>
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <span>Issue persisting?</span>
            <Link href="/help" className="text-primary font-bold hover:underline">
              Contact Tech Support &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-on-surface-variant border-t border-surface-variant bg-surface">
        <p>© {new Date().getFullYear()} Future Farms. All rights reserved.</p>
      </footer>
    </div>
  );
}
