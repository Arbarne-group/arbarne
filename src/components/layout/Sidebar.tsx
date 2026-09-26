

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { OnboardingStage, clearLocalAppData } from "@/lib/onboardingGuard";
import { ChevronRightIcon } from "lucide-react";

interface SidebarProps {
  userName?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onboardingStage?: OnboardingStage;
  completedPillarsCount?: number;
  hasAssessmentHistory?: boolean;
}

export default function Sidebar({
  userName = "Farmer",
  collapsed = false,
  onToggleCollapse,
  onboardingStage = "INITIAL_IN_PROGRESS",
  completedPillarsCount = 0,
  hasAssessmentHistory = false,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  /* ============================================================
     ONBOARDING / ACCESS LOGIC
     ============================================================ */

  const isInitialSurveyIncomplete =
    onboardingStage === "INITIAL_IN_PROGRESS";

  const platformUnlocked = !isInitialSurveyIncomplete;

  // FIX (Bug 2): My Farm should unlock on ANY assessment history,
  // not only once a full 25/25 pillar is complete. A user who has
  // started (or even mostly finished) an assessment but hasn't
  // 100%-completed one whole pillar was previously locked out here
  // even though getRouteAccess() would already let them into /dashboard.
  const dashboardUnlocked = hasAssessmentHistory || completedPillarsCount >= 1;

  /* ============================================================
     LOGO DESTINATION
     ============================================================ */

  const logoHref = isInitialSurveyIncomplete
    ? "/onboarding"
    : dashboardUnlocked
      ? "/dashboard"
      : "/assessment";

  /* ============================================================
     NAVIGATION ACCESS
     ============================================================ */

  const isItemLocked = (itemHref: string) => {
    if (isInitialSurveyIncomplete) {
      return itemHref !== "/onboarding";
    }

    if (itemHref === "/dashboard" && !dashboardUnlocked) {
      return true;
    }

    return false;
  };

  const isMyFarmUnlocked = !isItemLocked("/dashboard");

  /* ============================================================
     MAIN NAVIGATION
     ============================================================ */

  const navItems = [
    {
      label: "Overview",
      href: "/overview",
      icon: "dashboard",
    },
    {
      label: "My Farm",
      href: "/dashboard",
      icon: "agriculture",
    },
    {
      label: "Assessment",
      href: "/assessment",
      icon: "fact_check",
    },
    {
      label: "Digital Learning",
      href: "/learning",
      icon: "school",
      badge: "Soon",
    },
    {
      label: "Opportunity Desk",
      href: "/opportunities",
      icon: "lightbulb",
      badge: "Soon",
    },
    {
      label: "Service Desk",
      href: "/service-desk",
      icon: "support_agent",
      badge: "Soon",
    },
  ];
  // FIX (Bug 1): previously this list was .filter()'d to remove
  // "Overview" once My Farm unlocked. Overview should stay visible
  // and accessible at all times, so the filter has been removed.

  /* ============================================================
     BOTTOM NAVIGATION
     ============================================================ */

  const bottomItems = [
    {
      label: "Help Center",
      href: "#",
      icon: "help",
    },
    {
      label: "Contact Us",
      href: "#",
      icon: "mail",
    },
  ];

  /* ============================================================
     NAVIGATION CLICK HANDLER
     ============================================================ */

  const handleItemClick = (
    e: React.MouseEvent,
    itemHref: string
  ) => {
    /*
     * If onboarding is incomplete, keep the user in onboarding.
     */
    if (
      isInitialSurveyIncomplete &&
      itemHref !== "/onboarding"
    ) {
      e.preventDefault();
      router.push("/onboarding");
      return;
    }

    /*
     * My Farm requires at least one completed assessment pillar
     * (or, now, any assessment history at all).
     */
    if (
      itemHref === "/dashboard" &&
      !dashboardUnlocked
    ) {
      e.preventDefault();
      router.push("/assessment");
      return;
    }
  };

  /* ============================================================
     ACTIVE STATE
     ============================================================ */

  const isItemActive = (itemHref: string) => {
    if (itemHref === "/overview") {
      return pathname === "/overview";
    }

    if (itemHref === "/assessment") {
      return pathname.startsWith("/assessment");
    }

    if (itemHref === "/dashboard") {
      return pathname.startsWith("/dashboard");
    }

    return pathname === itemHref;
  };

  return (
    <nav
      className={`
        h-screen
        fixed
        left-0
        top-0
        hidden
        md:flex
        flex-col
        z-40
        select-none
        no-print
        print:hidden

        bg-primary
        text-on-primary

        border-r
        border-white/10

        transition-all
        duration-300
        ease-in-out

        ${
          collapsed
            ? "w-20"
            : "w-64"
        }
      `}
    >
      {/* ========================================================
          SIDEBAR HEADER
          ======================================================== */}

      <div
        className={`
          h-20
          min-h-20
          flex
          items-center
          shrink-0

          border-b
          border-white/10

          transition-all

          ${
            collapsed
              ? "px-2"
              : "px-3.5"
          }
        `}
      >
        {/* ======================================================
            COLLAPSED HEADER
            ====================================================== */}

        {collapsed ? (
          <div className="w-full flex items-center justify-between gap-1">

            {/* Logo */}
            <Link
              href={logoHref}
              className="
                flex
                items-center
                justify-center
                p-1
                rounded-xl
                hover:bg-white/10
                transition-colors
              "
              title="Future Farms"
            >
              <Image
                src="/ffi-white-vertical.png"
                alt="Future Farms"
                width={60}
                height={60}
                className="
                  h-120
                  w-auto
                  max-w-[52px]
                  object-contain
                "
                priority
              />
            </Link>

            {/* Expand Button */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="
                  w-8
                  h-8
                  rounded-lg

                  flex
                  items-center
                  justify-center

                  text-white/75
                  hover:text-white
                  hover:bg-white/10

                  transition-colors

                  cursor-pointer
                  shrink-0
                "
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRightIcon
                  className="w-5 h-5 rotate-180"
                />
              </button>
            )}
          </div>
        ) : (

          /* ====================================================
             EXPANDED HEADER
             ==================================================== */

          <div className="w-full flex items-center justify-between gap-2">

            {/* Logo */}
            <Link
              href={logoHref}
              className="
                flex
                items-center
                pl-1
                min-w-0
                rounded-lg
                hover:bg-white/10
                transition-colors
              "
              title="Future Farms"
            >
              <Image
                src="/ffi-white-horizontal.png"
                alt="Future Farms - An Initiative Of Arbarne Agriculture Group"
                width={190}
                height={48}
                className="
                  h-50
                  w-auto
                  max-w-[500px]
                  object-contain
                "
                priority
              />
            </Link>

            {/* Collapse Button */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="
                  w-9
                  h-9
                  rounded-xl

                  flex
                  items-center
                  justify-center

                  text-white/75
                  hover:text-white
                  hover:bg-white/10

                  transition-colors

                  cursor-pointer
                  shrink-0
                "
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          MAIN NAVIGATION
          ======================================================== */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto

          py-5
          px-3

          flex
          flex-col
          gap-1.5

          bg-primary

          scrollbar-thin
          scrollbar-thumb-white/10
          scrollbar-track-transparent
        "
      >
        

        {navItems.map((item) => {
          const locked = isItemLocked(item.href);
          const isActive = isItemActive(item.href);

          const lockedHref =
            isInitialSurveyIncomplete
              ? "/onboarding"
              : item.href === "/dashboard"
                ? "/assessment"
                : item.href;

          return (
            <Link
              key={item.label}
              href={locked ? lockedHref : item.href}
              onClick={(e) =>
                handleItemClick(e, item.href)
              }
              title={
                collapsed
                  ? `${item.label}${
                      locked
                        ? item.href === "/dashboard"
                          ? " (Complete an assessment first)"
                          : " (Complete onboarding first)"
                        : ""
                    }`
                  : undefined
              }
              className={`
                rounded-xl

                flex
                items-center

                transition-all
                duration-200

                text-sm
                font-medium

                relative
                group

                ${
                  collapsed
                    ? "w-12 h-12 mx-auto justify-center"
                    : "px-3.5 py-3 gap-3"
                }

                ${
                  isActive
                    ? `
                      bg-secondary
                      text-white
                      font-semibold
                      shadow-sm
                    `
                    : locked
                      ? `
                        text-white/45
                        hover:bg-white/5
                        hover:text-white/70
                        cursor-pointer
                      `
                      : `
                        text-white/85
                        hover:bg-white/10
                        hover:text-white
                      `
                }
              `}
            >
             
              
              <span
                className={`
                  material-symbols-outlined
                  shrink-0

                  transition-colors

                  ${
                    collapsed
                      ? "text-[22px]"
                      : "text-[20px]"
                  }

                  ${
                    isActive
                      ? "fill text-white"
                      : locked
                        ? "text-white/45"
                        : "text-white/85"
                  }
                `}
              >
                {item.icon}
              </span>

              {/* ==================================================
                  LABEL + BADGE
                  ================================================== */}

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">

                  {/* Label */}
                  <span className="truncate whitespace-nowrap">
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && !locked && (
                    <span
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider

                        px-1.5
                        py-0.5

                        rounded-full

                        bg-brand-gold/15
                        text-brand-gold

                        border
                        border-brand-gold/25

                        ml-2
                        shrink-0
                      "
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Lock */}
                  {locked && (
                    <span
                      className="
                        material-symbols-outlined
                        text-[15px]
                        text-white/40
                        ml-2
                        shrink-0
                      "
                      title={
                        item.href === "/dashboard"
                          ? "Complete at least one assessment pillar first"
                          : "Complete onboarding first"
                      }
                    >
                      lock
                    </span>
                  )}
                </div>
              )}

              {/* ==================================================
                  COLLAPSED TOOLTIP
                  ================================================== */}

              {collapsed && (
                <div
                  className="
                    absolute
                    left-full
                    ml-3

                    px-3
                    py-2

                    bg-inverse-surface
                    text-inverse-on-surface

                    text-xs
                    font-semibold

                    rounded-lg

                    whitespace-nowrap

                    opacity-0
                    pointer-events-none

                    group-hover:opacity-100

                    transition-opacity

                    z-50
                    shadow-lg

                    flex
                    items-center
                    gap-2
                  "
                >
                  <span>
                    {item.label}
                  </span>

                  {locked && (
                    <span className="text-[10px] text-amber-300 font-bold">
                      {item.href === "/dashboard"
                        ? "Assessment Required"
                        : "Onboarding Required"}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* ========================================================
          BOTTOM NAVIGATION
          ======================================================== */}

      <div
        className="
          p-3

          border-t
          border-white/10

          mt-auto

          flex
          flex-col
          gap-1.5

          shrink-0

          bg-primary
        "
      >
        {/* Bottom Section Label */}
        {!collapsed && (
          <div
            className="
              px-3
              pb-1.5

              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]

              text-white/40
            "
          >
            Support
          </div>
        )}

        {/* ======================================================
            HELP + CONTACT
            ====================================================== */}

        {bottomItems.map((item) => {
          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              title={
                collapsed
                  ? item.label
                  : undefined
              }
              className={`
                rounded-xl

                flex
                items-center

                transition-all
                duration-200

                text-sm
                font-medium

                relative
                group

                ${
                  collapsed
                    ? "w-12 h-10 mx-auto justify-center"
                    : "px-3.5 py-2.5 gap-3"
                }

                ${
                  isActive
                    ? `
                      bg-secondary
                      text-white
                      font-semibold
                    `
                    : `
                      text-white/75
                      hover:bg-white/10
                      hover:text-white
                    `
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2

                    w-1
                    h-6

                    rounded-r-full

                    bg-white
                  "
                />
              )}

              {/* Icon */}
              <span
                className={`
                  material-symbols-outlined
                  shrink-0
                  text-[20px]

                  ${
                    isActive
                      ? "fill text-white"
                      : "text-white/75"
                  }
                `}
              >
                {item.icon}
              </span>

              {/* Label */}
              {!collapsed && (
                <span className="truncate whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* Collapsed Tooltip */}
              {collapsed && (
                <div
                  className="
                    absolute
                    left-full
                    ml-3

                    px-3
                    py-2

                    bg-inverse-surface
                    text-inverse-on-surface

                    text-xs
                    font-semibold

                    rounded-lg

                    whitespace-nowrap

                    opacity-0
                    pointer-events-none

                    group-hover:opacity-100

                    transition-opacity

                    z-50
                    shadow-lg
                  "
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* ======================================================
            DIVIDER
            ====================================================== */}

        <div className="h-px bg-white/10 my-1" />

        {/* ======================================================
            LOGOUT
            ====================================================== */}

        <button
          type="button"
          onClick={() => {
            clearLocalAppData();
            signOut(() => router.push("/"));
          }}
          title={
            collapsed
              ? "Sign Out"
              : undefined
          }
          className={`
            text-white

            font-medium
            rounded-xl
            bg-secondary

            hover:bg-secondary/50
            hover:text-white

            transition-all
            duration-200

            flex
            items-center

            text-sm

            relative
            group

            cursor-pointer
            text-left

            ${
              collapsed
                ? "w-12 h-10 mx-auto justify-center"
                : "px-3.5 py-2.5 gap-3 mt-0.5"
            }
          `}
        >
          {/* Icon */}
          <span
            className="
              material-symbols-outlined
              text-[20px]
              text-white
              shrink-0
            "
          >
            logout
          </span>

          {/* Label */}
          {!collapsed && (
            <span>
              Sign Out
            </span>
          )}

          {/* Collapsed Tooltip */}
          {collapsed && (
            <div
              className="
                absolute
                left-full
                ml-3

                px-3
                py-2

                bg-inverse-surface
                text-inverse-on-surface

                text-xs
                font-semibold

                rounded-lg

                whitespace-nowrap

                opacity-0
                pointer-events-none

                group-hover:opacity-100

                transition-opacity

                z-50
                shadow-lg
              "
            >
              Sign Out
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}