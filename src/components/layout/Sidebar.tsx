"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { OnboardingStage } from "@/lib/onboardingGuard";

interface SidebarProps {
  userName?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onboardingStage?: OnboardingStage;
  completedPillarsCount?: number;
}

export default function Sidebar({
  userName = "Farmer",
  collapsed = false,
  onToggleCollapse,
  onboardingStage = "FULLY_COMPLETED",
  completedPillarsCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const isSurvey1 = onboardingStage === "INITIAL_IN_PROGRESS";
  const isSurvey2 = onboardingStage === "INITIAL_COMPLETED" || onboardingStage === "ADDITIONAL_COMPLETED";

  // Compute effective brand logo destination
  const logoHref = isSurvey1 || isSurvey2
    ? "/onboarding"
    : completedPillarsCount < 1
    ? "/assessment"
    : "/dashboard";

  const navItems = [
    { label: "Overview", href: "/onboarding", icon: "dashboard" },
    { label: "My Farm", href: "/dashboard", icon: "agriculture" },
    { label: "Assessment", href: "/assessment", icon: "fact_check" },
    { label: "Digital Learning", href: "/learning", icon: "school", badge: "Soon" },
    { label: "Opportunity Desk", href: "/opportunities", icon: "lightbulb", badge: "Soon" },
    { label: "Service Desk", href: "/service-desk", icon: "support_agent", badge: "Soon" },
  ];

  const bottomItems = [
    { label: "Help Center", href: "/help", icon: "help" },
    { label: "Contact Us", href: "/contact", icon: "mail" },
  ];

  // Helper to determine if an individual item is locked
  const isItemLocked = (itemHref: string) => {
    if (isSurvey1 || isSurvey2) {
      // During Survey 1 and Survey 2, Overview (/onboarding) is unlocked; other pages are locked
      return itemHref !== "/onboarding";
    }
    // Fully completed onboarding:
    // A user cannot access the dashboard without completing at least 1 pillar assessment!
    if (itemHref === "/dashboard" && completedPillarsCount < 1) {
      return true;
    }
    return false;
  };

  const handleItemClick = (e: React.MouseEvent, itemHref: string) => {
    if ((isSurvey1 || isSurvey2) && itemHref !== "/onboarding") {
      e.preventDefault();
      router.push("/onboarding");
      return;
    }
    if (itemHref === "/dashboard" && completedPillarsCount < 1) {
      e.preventDefault();
      router.push("/assessment");
      return;
    }
  };

  return (
    <nav
      className={`h-full fixed left-0 top-0 hidden md:flex flex-col bg-surface-container-lowest border-r border-surface-variant z-40 transition-all duration-300 ease-in-out select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header - Exact h-20 border-b aligning seamlessly with Desktop Top Header */}
      <div className="h-20 border-b border-surface-variant flex items-center justify-between px-3.5 transition-all shrink-0">
        {collapsed ? (
          <div className="w-full flex items-center justify-center">
            <Link
              href={logoHref}
              className="flex items-center justify-center p-1.5 rounded-xl hover:bg-surface-container-high transition-colors"
              title="Future Farms"
            >
              <Image
                src="/logo-icon.webp"
                alt="Future Farms"
                width={48}
                height={48}
                className="h-11 w-11 object-contain drop-shadow-xs"
                priority
              />
            </Link>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between gap-2">
            <Link href={logoHref} className="flex items-center pl-1">
              <Image
                src="/logo.webp"
                alt="Future Farms - An Initiative Of Arbarne Agriculture Group"
                width={190}
                height={48}
                className="h-10 w-auto max-w-[170px] object-contain"
                priority
              />
            </Link>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-[20px]">
                  menu_open
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const locked = isItemLocked(item.href);
          const isActive =
            pathname === item.href ||
            (item.href === "/onboarding" && pathname.startsWith("/onboarding")) ||
            (item.href === "/assessment" && pathname.startsWith("/assessment"));

          return (
            <Link
              key={item.label}
              href={
                locked
                  ? isSurvey1 || isSurvey2
                    ? "/onboarding"
                    : "/assessment"
                  : item.href
              }
              onClick={(e) => handleItemClick(e, item.href)}
              title={
                collapsed
                  ? `${item.label}${
                      locked
                        ? item.href === "/dashboard" && completedPillarsCount < 1
                          ? " (Requires 1 Completed Pillar Assessment)"
                          : " (Locked)"
                        : ""
                    }`
                  : undefined
              }
              className={`rounded-xl flex items-center transition-colors text-sm font-medium relative group ${
                collapsed
                  ? "w-12 h-12 mx-auto justify-center"
                  : "px-4 py-3 gap-3"
              } ${
                isActive
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : locked
                  ? "text-on-surface-variant/70 hover:bg-surface-container-high/60 cursor-pointer"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined shrink-0 ${
                  collapsed ? "text-[22px]" : "text-[20px]"
                } ${isActive ? "fill text-white" : "text-on-surface-variant"}`}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                  {item.badge && !locked && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant/80 border border-outline-variant/30 ml-1.5 shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {locked && (
                    <span
                      className="material-symbols-outlined text-[15px] text-outline ml-1 shrink-0"
                      title={
                        item.href === "/dashboard" && completedPillarsCount < 1
                          ? "Requires at least 1 completed pillar assessment"
                          : "Locked"
                      }
                    >
                      lock
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip on hover when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {locked && (
                    <span className="text-[10px] text-amber-300 font-bold">
                      {item.href === "/dashboard" && completedPillarsCount < 1
                        ? "(1 Pillar Required)"
                        : "(Locked)"}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav Actions */}
      <div className="p-3 border-t border-surface-variant mt-auto flex flex-col gap-1.5 shrink-0">
        {bottomItems.map((item) => {
          const locked = false;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`rounded-xl flex items-center transition-colors text-sm font-medium relative group ${
                collapsed
                  ? "w-12 h-10 mx-auto justify-center"
                  : "px-4 py-2.5 gap-3"
              } ${
                isActive
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined shrink-0 text-[20px] ${
                  isActive ? "fill text-white" : "text-on-surface-variant"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                  {locked && (
                    <span className="material-symbols-outlined text-[14px] text-outline ml-1 shrink-0">
                      lock
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip on hover when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          type="button"
          onClick={() => signOut(() => router.push("/"))}
          title={collapsed ? "Sign Out" : undefined}
          className={`text-error font-medium rounded-xl hover:bg-error-container/20 transition-colors flex items-center text-sm relative group cursor-pointer text-left ${
            collapsed
              ? "w-12 h-10 mx-auto justify-center"
              : "px-4 py-2.5 gap-3 mt-1"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-error shrink-0">
            logout
          </span>
          {!collapsed && <span>Sign Out</span>}

          {/* Tooltip on hover when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
              Sign Out
            </div>
          )}
        </button>

        {/* Expand toggle at bottom when collapsed */}
        {collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="w-12 h-10 mx-auto mt-1 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">
              chevron_right
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
