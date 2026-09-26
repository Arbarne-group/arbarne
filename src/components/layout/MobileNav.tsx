
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OnboardingStage } from "@/lib/onboardingGuard";

interface MobileNavProps {
  onboardingStage?: OnboardingStage;
  completedPillarsCount?: number;
  hasAssessmentHistory?: boolean;
}

export default function MobileNav({
  onboardingStage = "FULLY_COMPLETED",
  completedPillarsCount = 0,
  hasAssessmentHistory = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isSurvey1 = onboardingStage === "INITIAL_IN_PROGRESS";

  
  const isItemLocked = (itemHref: string) => {
    if (isSurvey1) return itemHref !== "/onboarding";

    // FIX (Bug 2): unlock on any assessment history, not only once
    // a full 25/25 pillar is complete.
    if (itemHref === "/dashboard" && !hasAssessmentHistory && completedPillarsCount < 1) {
      return true;
    }

    return false;
  };

  const navItems = [
    { label: "Overview", href: "/overview", icon: "dashboard" },
    { label: "My Farm", href: "/dashboard", icon: "agriculture" },
    { label: "Assess", href: "/assessment", icon: "fact_check", highlight: true },
    { label: "Learn", href: "/learning", icon: "school" },
    { label: "Opps", href: "/opportunities", icon: "lightbulb" },
  ];
  
  const handleItemClick = (e: React.MouseEvent, itemHref: string) => {
    if (isSurvey1 && itemHref !== "/onboarding") {
      e.preventDefault();
      router.push("/onboarding");
      return;
    }
    if (itemHref === "/dashboard" && !hasAssessmentHistory && completedPillarsCount < 1) {
      e.preventDefault();
      router.push("/assessment");
      return;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-surface border-t border-surface-variant shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden no-print print:hidden">
      {navItems.map((item) => {
        const locked = isItemLocked(item.href);
        const isActive =
          pathname === item.href ||
          (item.href === "/overview" && pathname === "/overview") ||
          (item.href === "/assessment" && pathname.startsWith("/assessment"));

        if (item.highlight) {
          return (
            <Link
              key={item.label}
              href={locked ? (isSurvey1 ? "/onboarding" : "/assessment") : item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-1.5 active:scale-95 transition-transform ${
                locked
                  ? "bg-surface-container-high text-on-surface-variant/80 border border-outline-variant/40"
                  : isActive
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] fill">
                {locked ? "lock" : item.icon}
              </span>
              <span className={`text-[10px] ${isActive && !locked ? "font-bold" : ""}`}>
                {locked ? "Locked" : item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={locked ? (isSurvey1 ? "/onboarding" : "/assessment") : item.href}
            onClick={(e) => handleItemClick(e, item.href)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors relative ${
              isActive
                ? "text-primary font-bold"
                : locked
                ? "text-on-surface-variant/60"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive ? "fill" : ""
              }`}
            >
              {locked ? "lock" : item.icon}
            </span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
