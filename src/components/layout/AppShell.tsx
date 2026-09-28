"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppUser as useUser } from "@/hooks/useAppUser";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import ComingSoonModal from "./ComingSoonModal";
import {
  OnboardingStage,
  clearLocalAppData,
  computeOnboardingStageFromUser,
  countCompletedPillarsFromAnswers,
  getRouteAccess,
  isFarmUnlockedCached,
  setFarmUnlockedCached,
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
  const [completedPillarsCount, setCompletedPillarsCount] = useState<number>(() => {
    // First-paint values. Persisted unlock flag + local answers, so the
    // sidebar never flashes
    if (typeof window === "undefined") return 0;
    try {
      const saved =
        localStorage.getItem("future_farms_assessment_answers") ||
        localStorage.getItem("future_farms_all_answers");
      if (saved) return countCompletedPillarsFromAnswers(JSON.parse(saved));
    } catch {}
    return 0;
  });
  const [hasAssessmentHistory, setHasAssessmentHistory] = useState<boolean>(() =>
    isFarmUnlockedCached()
  );
  const [userEmail, setUserEmail] = useState<string>("");
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);
  // Staff bypass the farmer funnel: treat as fully complete for access.
  const [isStaffUser, setIsStaffUser] = useState(false);
  const STAFF_ROLES = ["FFDeveloper", "FFAdmin", "FFStaff"];
  const wasSignedIn = useRef(false);

  // Any Clerk sign-out path (sidebar button, avatar menu) wipes local data
  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      wasSignedIn.current = true;
      return;
    }
    if (wasSignedIn.current) {
      wasSignedIn.current = false;
      clearLocalAppData();
    }
  }, [user, isLoaded]);

  // Presence heartbeat: lets the admin side show who is online / last seen.
  useEffect(() => {
    if (!isLoaded) return;
    let stopped = false;
    const beat = () => {
      fetch("/api/presence/heartbeat", { method: "POST" }).catch(() => {});
    };
    beat();
    const timer = setInterval(() => {
      if (!stopped) beat();
    }, 60 * 1000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [isLoaded]);

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
      setUserEmail(email);
    } else {
      const cached = localStorage.getItem("future_farms_user");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          if (u.email) {
            email = u.email;
            setUserEmail(email);
          }
          if (u.role && STAFF_ROLES.includes(u.role)) {
            setIsStaffUser(true);
            setOnboardingStage("FULLY_COMPLETED");
            setStatusLoaded(true);
            console.debug("[appshell] stage source: localStorage cache", {
              email: u.email,
              role: u.role,
              staff: true,
            });
          } else {
            // Only trust the cache when it actually carries profile data —
            // a bare login stub (no role, no relations) must not trigger the
            // guard before the server responds.
            const hasSurveyData = [
              u.farmerProfile,
              u.farmManagement,
              u.operatingStyle,
              u.digitalPlatform,
              u.aspiration,
              u.farmLocation,
              u.farmCharacteristics,
              u.farmingSystem,
              u.businessExperience,
              u.householdLabour,
              u.countryCode,
              u.farmingType,
              u.businessName,
            ].some(Boolean);
            if (u.role || hasSurveyData) {
              const status = computeOnboardingStageFromUser(u);
              setOnboardingStage(status.stage);
              setStatusLoaded(true);
            }
          }
        } catch (e) {}
      }
    }

    if (!email) {
      if (isLoaded) {
        setStatusLoaded(true);
      }
      return;
    }

    // Ensure user is recorded and synced to Google Sheet
    fetch("/api/auth/register-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});

    // Refresh stage from API to keep in sync with database
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          if (data.user.email) {
            setUserEmail(data.user.email);
          }
          if (data.user.role && STAFF_ROLES.includes(data.user.role)) {
            setIsStaffUser(true);
            setOnboardingStage("FULLY_COMPLETED");
            console.debug("[appshell] stage source: server", {
              email: data.user.email,
              role: data.user.role,
              staff: true,
            });
          } else {
            const status = computeOnboardingStageFromUser(data.user);
            setOnboardingStage(status.stage);
            console.debug("[appshell] stage source: server", {
              email: data.user.email,
              role: data.user.role,
              stage: status.stage,
            });
          }
          localStorage.setItem(
            "future_farms_user",
            JSON.stringify({ ...data.user, stage: "FULLY_COMPLETED" })
          );
        } else if (data.stage) {
          setOnboardingStage(data.stage);
        }
        if (data.completedPillarsCount !== undefined) {
          setCompletedPillarsCount(data.completedPillarsCount);
          if (data.completedPillarsCount >= 1) setFarmUnlockedCached(true);
        }
        if (data.hasAssessmentHistory !== undefined) {
          setHasAssessmentHistory(data.hasAssessmentHistory);
          if (data.hasAssessmentHistory) setFarmUnlockedCached(true);
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

    const check = getRouteAccess(pathname, onboardingStage, {
      completedPillarsCount,
      hasAssessmentHistory,
      isStaff: isStaffUser,
    });
    // Decision trace: open DevTools console to see exactly which condition
    // allowed or redirected the current route.
    console.debug("[guard]", {
      pathname,
      onboardingStage,
      isStaffUser,
      completedPillarsCount,
      hasAssessmentHistory,
      statusLoaded,
      allowed: check.allowed,
      redirectTo: check.redirectTo,
      reason: check.reason,
    });
    if (!check.allowed && check.redirectTo && pathname !== check.redirectTo) {
      setRedirectNotice(
        check.reason
          ? `${check.message || "Please complete the required onboarding survey."} [${check.reason}]`
          : check.message || "Please complete the required onboarding survey."
      );
      router.replace(check.redirectTo);

      const timer = setTimeout(() => {
        setRedirectNotice(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    pathname,
    onboardingStage,
    completedPillarsCount,
    hasAssessmentHistory,
    isStaffUser,
    statusLoaded,
    router,
  ]);

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
        hasAssessmentHistory={hasAssessmentHistory}
      />

      {/* Main Content Area - Transitions smoothly between ml-64 and ml-20 */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header
          userEmail={userEmail}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onboardingStage={onboardingStage}
          completedPillarsCount={completedPillarsCount}
          hasAssessmentHistory={hasAssessmentHistory}
        />

        {/* Floating Redirect Alert Banner */}
        {redirectNotice && (
          <div className="mx-4 mt-3 p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn shrink-0 no-print print:hidden">
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

          const isSurveyStep =
            pathname.startsWith("/onboarding/") && pathname !== "/onboarding";

          return (
            <>
              <main
                className={`flex-1 overflow-y-auto bg-surface relative ${
                  isSurveyStep ? "pb-6 md:pb-8" : "pb-20 md:pb-8"
                } transition-opacity ${
                  isComingSoonPage ? "pointer-events-none select-none opacity-60" : ""
                }`}
                tabIndex={isComingSoonPage ? -1 : undefined}
                aria-hidden={isComingSoonPage ? "true" : undefined}
              >
                {children}
              </main>

              {/* Blocking Coming Soon Pop Window for Digital Learning, Opportunity Desk, and Service Desk */}
              {isComingSoonPage && <ComingSoonModal pathname={pathname} />}

              {/* Mobile Sticky Bottom Nav - Hidden on active survey steps so action buttons are unblocked */}
              {!isSurveyStep && (
                <MobileNav
                  onboardingStage={onboardingStage}
                  completedPillarsCount={completedPillarsCount}
                  hasAssessmentHistory={hasAssessmentHistory}
                />
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
