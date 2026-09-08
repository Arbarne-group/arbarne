"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton, Show, SignInButton, useUser, useClerk } from "@clerk/nextjs";

import { OnboardingStage } from "@/lib/onboardingGuard";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onboardingStage?: OnboardingStage;
}

export default function Header({
  userName = "Farmer",
  userRole = "Farm Owner",
  collapsed = false,
  onToggleCollapse,
  onboardingStage = "FULLY_COMPLETED",
}: HeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const effectiveName =
    user?.fullName ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") ||
    userName ||
    "Farmer";

  const isSurvey1 = onboardingStage === "INITIAL_IN_PROGRESS";
  const isSurvey2 =
    onboardingStage === "INITIAL_COMPLETED" || onboardingStage === "ADDITIONAL_COMPLETED";

  const logoHref = isSurvey1
    ? "/onboarding/step-1"
    : isSurvey2
    ? "/onboarding"
    : "/dashboard";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Top App Bar - Exact h-16 */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 h-16 bg-surface border-b border-surface-variant md:hidden">
        <Link href={logoHref} className="flex items-center">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={180}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2 text-on-surface-variant relative" ref={menuRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="p-1.5 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          <Show when="signed-in">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="px-3 py-1.5 text-xs font-semibold bg-primary text-on-primary rounded-xl"
            >
              Sign In
            </Link>
          </Show>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant p-4 z-50 animate-fade-in text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-on-surface">Notifications</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/40">
                  <p className="font-semibold text-on-surface text-[11px] mb-0.5">Welcome to Future Farms</p>
                  <p className="text-on-surface-variant text-[10px]">Complete your 8-pillar assessment to unlock your tailored roadmap.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Top Nav Bar - Exact h-20 aligning seamlessly with Sidebar */}
      <div className="hidden md:flex justify-between items-center px-6 h-20 bg-surface border-b border-surface-variant sticky top-0 z-30 transition-all shrink-0">
        {/* Left Side: Toggle Sidebar & Context */}
        <div className="flex items-center gap-3">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer flex items-center justify-center border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[20px]">
                {collapsed ? "menu" : "menu_open"}
              </span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
            <span className="text-primary font-bold">Future Farms</span>
            <span className="text-outline-variant/60">/</span>
            <span className="text-on-surface font-medium">Cultivating African Agriculture</span>
          </div>
        </div>

        {/* Right Side: Notifications & User Profile */}
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
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-surface border border-surface-variant/40">
                    <p className="font-semibold text-on-surface text-xs mb-0.5">Assessment Hub Ready</p>
                    <p className="text-on-surface-variant text-[11px]">Begin your 8-pillar capability diagnostic.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Controls */}
          <Show when="signed-in">
            <div className="flex items-center gap-3 pl-2 border-l border-surface-variant">
              <div className="text-right hidden lg:block leading-tight">
                <span className="text-sm font-semibold text-on-surface block">
                  {effectiveName}
                </span>
                <span className="text-xs text-on-surface-variant block">
                  {userRole}
                </span>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-primary/20",
                  },
                }}
              />
            </div>
          </Show>

          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-xs font-semibold bg-primary text-on-primary rounded-xl shadow-xs hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          </Show>
        </div>
      </div>
    </>
  );
}
