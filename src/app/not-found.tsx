"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const STAFF_ROLES = ["FFDeveloper", "FFAdmin", "FFStaff"];
const FARMER_ROLES = ["FFFarmer", "FFFarmManager", "Other"];

function ActionButton({
  href,
  icon,
  label,
  primary,
}: {
  href: string;
  icon: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 ${
        primary
          ? "bg-primary hover:bg-primary/90 text-on-primary"
          : "bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-semibold"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function NotFound() {
  const [role, setRole] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // Detect user type so every link points at their own pages.
  useEffect(() => {
    fetch("/api/auth/profile/details", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.role) setRole(data.user.role);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  const isStaff = role !== null && STAFF_ROLES.includes(role);
  const isFarmer = role !== null && FARMER_ROLES.includes(role);

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
        {checked &&
          (isStaff ? (
            <Link
              href="/a/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Admin Dashboard</span>
            </Link>
          ) : isFarmer ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">agriculture</span>
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In</span>
            </Link>
          ))}
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="max-w-xl w-full text-center bg-surface rounded-3xl p-6 sm:p-10 shadow-ambient border border-outline-variant/50 relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-500 absolute top-0 left-0" />

          {/* Graphical Compass / Crop Illustration */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary shadow-inner">
            <span className="material-symbols-outlined text-4xl sm:text-5xl animate-bounce">
              explore_off
            </span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
            Error 404 • Acreage Not Found
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-3">
            Uncharted Farm Territory
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed mb-8">
            The plot, survey, or diagnostic resource you are looking for has either been moved,
            re-indexed, or does not exist in our registry.
          </p>

          {/* Action Navigation Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {!checked ? (
              <div className="h-[46px] w-full sm:w-64 rounded-xl bg-surface-container-high animate-pulse" />
            ) : isStaff ? (
              <>
                <ActionButton href="/a/dashboard" icon="dashboard" label="Admin Dashboard" primary />
                <ActionButton href="/a/users" icon="group" label="Users" />
                <ActionButton href="/a/audit" icon="receipt_long" label="Audit Log" />
              </>
            ) : isFarmer ? (
              <>
                <ActionButton href="/dashboard" icon="dashboard" label="Farm Dashboard" primary />
                <ActionButton href="/assessment" icon="fact_check" label="Assessment Hub" />
                <ActionButton href="/" icon="home" label="Home" />
              </>
            ) : (
              <>
                <ActionButton href="/login" icon="login" label="Sign In" primary />
                <ActionButton href="/" icon="home" label="Home" />
              </>
            )}
          </div>

          {/* Quick Help Link */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <span>Need assistance navigating your farm profile?</span>
            <Link href="/help" className="text-primary font-bold hover:underline">
              Help Center &rarr;
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
