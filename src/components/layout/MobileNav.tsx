"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OnboardingStage } from "@/lib/onboardingGuard";

interface MobileNavProps {
  onboardingStage?: OnboardingStage;
}

export default function MobileNav({
  onboardingStage = "FULLY_COMPLETED",
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isSurvey1 = onboardingStage === "INITIAL_IN_PROGRESS";
  const isSurvey2 = onboardingStage === "INITIAL_COMPLETED" || onboardingStage === "ADDITIONAL_COMPLETED";

  const navItems = [
    { label: "Overview", href: "/onboarding", icon: "dashboard" },
    { label: "My Farm", href: "/dashboard", icon: "agriculture" },
    { label: "Assess", href: "/assessment", icon: "fact_check", highlight: true },
    { label: "Learn", href: "/learning", icon: "school" },
    { label: "Opps", href: "/opportunities", icon: "lightbulb" },
  ];

  const isItemLocked = (itemHref: string) => {
    if (isSurvey1) return true;
    if (isSurvey2) return itemHref !== "/onboarding";
    return false;
  };

  const handleItemClick = (e: React.MouseEvent, itemHref: string) => {
    if (isSurvey1) {
      e.preventDefault();
      router.push("/onboarding/step-1");
      return;
    }
    if (isSurvey2 && itemHref !== "/onboarding") {
      e.preventDefault();
      router.push("/onboarding");
      return;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-surface-variant shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const locked = isItemLocked(item.href);
        const isActive =
          pathname === item.href ||
          (item.href === "/onboarding" && pathname.startsWith("/onboarding"));

        if (item.highlight) {
          return (
            <Link
              key={item.label}
              href={locked ? (isSurvey1 ? "/onboarding/step-1" : "/onboarding") : item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-1.5 active:scale-95 transition-transform ${
                locked
                  ? "bg-surface-container-high text-on-surface-variant/80 border border-outline-variant/40"
                  : "bg-primary text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] fill">
                {locked ? "lock" : item.icon}
              </span>
              <span className="text-[10px] font-bold">
                {locked ? "Locked" : item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={locked ? (isSurvey1 ? "/onboarding/step-1" : "/onboarding") : item.href}
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
