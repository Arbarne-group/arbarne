"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import ComingSoonModal from "./ComingSoonModal";
import {
  OnboardingStage,
  computeOnboardingStageFromUser,
  countCompletedPillarsFromAnswers,
  getRouteAccess,
} from "@/lib/onboardingGuard";

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export default function AppShell({
  children,
  userName,
  userRole = "Farm Owner",
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>("FULLY_COMPLETED");
  const [completedPillarsCount, setCompletedPillarsCount] = useState<number>(0);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  const effectiveUserName =
    userName ||
    user?.fullName ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") ||
    "Farmer";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("future_farms_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch (e) {
      // Ignore localStorage errors in restricted environments
    }

    try {
      const savedAnswers =
        localStorage.getItem("future_farms_assessment_answers") ||
        localStorage.getItem("future_farms_all_answers");
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        const cnt = countCompletedPillarsFromAnswers(parsed);
        setCompletedPillarsCount(cnt);
      }
    } catch (e) {}

    // Determine user email from Clerk or cached session
    let email = "";
    if (user?.primaryEmailAddress?.emailAddress) {
      email = user.primaryEmailAddress.emailAddress;
    } else {
      const cached = localStorage.getItem("future_farms_user");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          if (u.email) email = u.email;
          const status = computeOnboardingStageFromUser(u);
          setOnboardingStage(status.stage);
          setStatusLoaded(true);
        } catch (e) {}
      }
    }

    if (!email) {
      if (isLoaded) {
        setStatusLoaded(true);
      }
      return;
    }

    // Refresh stage from API to keep in sync with database
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const status = computeOnboardingStageFromUser(data.user);
          setOnboardingStage(status.stage);
          localStorage.setItem(
            "future_farms_user",
            JSON.stringify({ ...data.user, stage: status.stage })
          );
        } else if (data.stage) {
          setOnboardingStage(data.stage);
        }
        if (data.completedPillarsCount !== undefined) {
          setCompletedPillarsCount(data.completedPillarsCount);
        }
      })
      .catch(() => {})
      .finally(() => setStatusLoaded(true));

    // Optional keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((prev) => {
          const next = !prev;
          try {
            localStorage.setItem("future_farms_sidebar_collapsed", String(next));
          } catch (_) {}
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [user, isLoaded]);

  // Navigation Guardrail: Enforce flow according to onboarding status
  useEffect(() => {
    if (!statusLoaded) return;

    const check = getRouteAccess(pathname, onboardingStage, { completedPillarsCount });
    if (!check.allowed && check.redirectTo && pathname !== check.redirectTo) {
      setRedirectNotice(check.message || "Please complete the required onboarding survey.");
      router.replace(check.redirectTo);

      const timer = setTimeout(() => {
        setRedirectNotice(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pathname, onboardingStage, completedPillarsCount, statusLoaded, router]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("future_farms_sidebar_collapsed", String(next));
      } catch (_) {}
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-background text-on-background overflow-hidden">
      {/* Desktop Persistent Sidebar with Expand/Collapse & Stage Locks */}
      <Sidebar
        userName={effectiveUserName}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        onboardingStage={onboardingStage}
        completedPillarsCount={completedPillarsCount}
      />

      {/* Main Content Area - Transitions smoothly between ml-64 and ml-20 */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header
          userName={effectiveUserName}
          userRole={userRole}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onboardingStage={onboardingStage}
          completedPillarsCount={completedPillarsCount}
        />

        {/* Floating Redirect Alert Banner */}
        {redirectNotice && (
          <div className="mx-4 mt-3 p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>{redirectNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setRedirectNotice(null)}
              className="p-1 text-primary/70 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {(() => {
          const isComingSoonPage =
            pathname === "/learning" ||
            pathname === "/opportunities" ||
            pathname === "/service-desk";

          return (
            <>
              <main
                className={`flex-1 overflow-y-auto bg-surface relative pb-20 md:pb-8 transition-opacity ${
                  isComingSoonPage ? "pointer-events-none select-none opacity-60" : ""
                }`}
                tabIndex={isComingSoonPage ? -1 : undefined}
                aria-hidden={isComingSoonPage ? "true" : undefined}
              >
                {children}
              </main>

              {/* Blocking Coming Soon Pop Window for Digital Learning, Opportunity Desk, and Service Desk */}
              {isComingSoonPage && <ComingSoonModal pathname={pathname} />}
            </>
          );
        })()}

        {/* Mobile Sticky Bottom Nav */}
        <MobileNav
          onboardingStage={onboardingStage}
          completedPillarsCount={completedPillarsCount}
        />
      </div>
    </div>
  );
}
