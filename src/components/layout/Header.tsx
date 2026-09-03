"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export default function Header({
  userName = "Keziah Wanjiku",
  userRole = "Farm Owner",
}: HeaderProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("future_farms_user");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 py-3.5 bg-surface border-b border-surface-variant md:hidden">
        <Link href="/onboarding" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary fill">
            agriculture
          </span>
          <span className="font-bold text-primary text-lg tracking-tight">
            Future Farms
          </span>
        </Link>
        <div className="flex items-center gap-2 text-on-surface-variant relative" ref={menuRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="p-1.5 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container overflow-hidden flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            {initials}
          </button>

          {/* Mobile Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-11 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant p-2 z-50 animate-fade-in text-left">
              <div className="px-3 py-2 border-b border-surface-variant/40 mb-1">
                <span className="font-bold text-xs text-on-surface block">{userName}</span>
                <span className="text-[11px] text-on-surface-variant">{userRole}</span>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">agriculture</span>
                <span>My Farm Radar</span>
              </Link>
              <Link
                href="/assessment"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">fact_check</span>
                <span>Assessment Hub</span>
              </Link>
              <Link
                href="/help"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">help</span>
                <span>Help Center</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-error-container/20 transition-colors text-left cursor-pointer border-t border-surface-variant/40 mt-1 pt-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant p-4 z-50 animate-fade-in text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-on-surface">Notifications</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/40">
                  <p className="font-semibold text-on-surface text-[11px] mb-0.5">Maturity Score Updated</p>
                  <p className="text-on-surface-variant text-[10px]">Highland Greens reached 82/100 (Advancing Stage).</p>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/40">
                  <p className="font-semibold text-on-surface text-[11px] mb-0.5">New Solar Grant Matched</p>
                  <p className="text-on-surface-variant text-[10px]">You qualify for the $25,000 Clean Energy facility.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Top Nav Actions */}
      <div className="hidden md:flex justify-end items-center px-8 py-3.5 bg-surface border-b border-surface-variant sticky top-0 z-30">
        <div className="flex items-center gap-4 text-on-surface-variant relative" ref={menuRef}>
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px] hover:text-primary transition-colors">
                notifications
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant p-4 z-50 animate-fade-in text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-xs text-on-surface">Notifications</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">2 Unread</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-surface border border-surface-variant/40">
                    <p className="font-semibold text-on-surface text-xs mb-0.5">Maturity Score Verified</p>
                    <p className="text-on-surface-variant text-[11px]">Highland Greens reached 82/100 (Advancing Stage).</p>
                    <span className="text-[10px] text-primary mt-1 inline-block font-semibold">Today</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-surface-variant/40">
                    <p className="font-semibold text-on-surface text-xs mb-0.5">Clean Energy Grant Match</p>
                    <p className="text-on-surface-variant text-[11px]">Eligible for $25,000 Solar Cold Chain funding.</p>
                    <span className="text-[10px] text-primary mt-1 inline-block font-semibold">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high p-1.5 pr-4 rounded-full transition-colors border border-outline-variant/40"
            >
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container overflow-hidden flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div className="text-left leading-tight">
                <span className="text-sm font-semibold text-on-surface block">
                  {userName}
                </span>
                <span className="text-xs text-on-surface-variant block">
                  {userRole}
                </span>
              </div>
              <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform ${profileOpen ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-60 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant p-2 z-50 animate-fade-in text-left">
                <div className="px-3.5 py-2.5 border-b border-surface-variant/40 mb-1.5">
                  <span className="font-bold text-xs text-on-surface block">{userName}</span>
                  <span className="text-[11px] text-on-surface-variant">{userRole}</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">agriculture</span>
                  <span>My Farm Radar</span>
                </Link>
                <Link
                  href="/assessment"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">fact_check</span>
                  <span>Assessment Diagnostic</span>
                </Link>
                <Link
                  href="/opportunities"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">lightbulb</span>
                  <span>Matched Opportunities</span>
                </Link>
                <Link
                  href="/help"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">help</span>
                  <span>Help Center &amp; FAQs</span>
                </Link>
                <div className="border-t border-surface-variant/40 mt-1.5 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error-container/20 transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
