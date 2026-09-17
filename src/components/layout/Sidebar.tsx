
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { OnboardingStage } from "@/lib/onboardingGuard";
import { ChevronRightIcon } from "lucide-react";

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
  onboardingStage = "INITIAL_IN_PROGRESS",
  completedPillarsCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  

  const isInitialSurveyIncomplete =
    onboardingStage === "INITIAL_IN_PROGRESS";

  const platformUnlocked =
    !isInitialSurveyIncomplete;

  const dashboardUnlocked =
    completedPillarsCount >= 1;

  

  const logoHref = isInitialSurveyIncomplete
    ? "/onboarding"
    : dashboardUnlocked
      ? "/dashboard"
      : "/assessment";

  

  

  // Helper to determine if an individual item is locked
  const isItemLocked = (itemHref: string) => {
    if (isInitialSurveyIncomplete) {
      return itemHref !== "/onboarding";
    }

    if (
      itemHref === "/dashboard" &&
      !dashboardUnlocked
    ) {
      return true;
    }

    return false;
  };

  const isMyFarmUnlocked = !isItemLocked("/dashboard");

  const navItems = [
    { label: "Overview", href: "/onboarding", icon: "dashboard" },
    { label: "My Farm", href: "/dashboard", icon: "agriculture" },
    { label: "Assessment", href: "/assessment", icon: "fact_check" },
    { label: "Digital Learning", href: "/learning", icon: "school", badge: "Soon" },
    { label: "Opportunity Desk", href: "/opportunities", icon: "lightbulb", badge: "Soon" },
    { label: "Service Desk", href: "/service-desk", icon: "support_agent", badge: "Soon" },
  ].filter((item) => {
    if (item.href === "/onboarding" && isMyFarmUnlocked) {
      return false;
    }
    return true;
  });

  const bottomItems = [
    { label: "Help Center", href: "/help", icon: "help" },
    { label: "Contact Us", href: "/contact", icon: "mail" },
  ];

  

  const handleItemClick = (
    e: React.MouseEvent,
    itemHref: string
  ) => {
    if (
      isInitialSurveyIncomplete &&
      itemHref !== "/onboarding"
    ) {
      e.preventDefault();

      router.push("/onboarding");

      return;
    }

    if (
      itemHref === "/dashboard" &&
      !dashboardUnlocked
    ) {
      e.preventDefault();

      router.push("/assessment");

      return;
    }
  };

  
  const isItemActive = (itemHref: string) => {
    if (itemHref === "/onboarding") {
      return pathname === "/onboarding";
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
        bg-surface-container-lowest
        border-r
        border-surface-variant
        z-40
        transition-all
        duration-300
        ease-in-out
        select-none
        no-print
        print:hidden
        ${
          collapsed
            ? "w-20"
            : "w-64"
        }
      `}
    >

      

      <div
        className={`
          h-20
          min-h-20
          border-b
          border-surface-variant
          flex
          items-center
          transition-all
          shrink-0
          ${
            collapsed
              ? "px-2"
              : "px-3.5"
          }
        `}
      >

       
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
                hover:bg-surface-container-high
                transition-colors
              "
              title="Future Farms"
            >
              <Image
                src="/ffi-green-vertical.png"
                alt="Future Farms"
                width={42}
                height={42}
                className="
                  h-48
                  w-auto
                  max-w-[200x]
                  object-contain
                "
                priority
              />
            </Link>

            {/* EXPAND BUTTON */}
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
                  text-on-surface-variant
                  hover:text-primary
                  hover:bg-surface-container-high
                  transition-colors
                  cursor-pointer
                  shrink-0
                "
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRightIcon className="w-5 h-5 rotate-180" />
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
              "
              title="Future Farms"
            >
              <Image
                src="/ffi-green-horizontal.png"
                alt="Future Farms - An Initiative Of Arbarne Agriculture Group"
                width={190}
                height={48}
                className="
                  h-48
                  w-auto
                  max-w-[200x]
                  object-contain
                "
                priority
              />
            </Link>

            {/* COLLAPSE BUTTON */}
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
                  text-on-surface-variant
                  hover:text-primary
                  hover:bg-surface-container-high
                  transition-colors
                  cursor-pointer
                  shrink-0
                "
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
               <ChevronRightIcon className="w-5 h-5 " />
              </button>
            )}

          </div>
        )}
      </div>

      {/* ========================================================
          MAIN NAVIGATION
          ======================================================== */}

      <div className="flex-1 min-h-0 overflow-y-auto py-4 px-3 flex flex-col gap-1.5">

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
                transition-colors
                text-sm
                font-medium
                relative
                group

                ${
                  collapsed
                    ? "w-12 h-12 mx-auto justify-center"
                    : "px-4 py-3 gap-3"
                }

                ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : locked
                      ? "text-on-surface-variant/70 hover:bg-surface-container-high/60 cursor-pointer"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }
              `}
            >

              {/* Icon */}
              <span
                className={`
                  material-symbols-outlined
                  shrink-0

                  ${
                    collapsed
                      ? "text-[22px]"
                      : "text-[20px]"
                  }

                  ${
                    isActive
                      ? "fill text-white"
                      : locked
                        ? "text-on-surface-variant/70"
                        : "text-on-surface-variant"
                  }
                `}
              >
                {item.icon}
              </span>

              {/* Label */}
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">

                  <span className="truncate whitespace-nowrap">
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && !locked && (
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        px-1.5
                        py-0.5
                        rounded-full
                        bg-surface-container-highest
                        text-on-surface-variant/80
                        border
                        border-outline-variant/30
                        ml-1.5
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
                        text-outline
                        ml-1
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
                    px-2.5
                    py-1.5
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
                    gap-1.5
                  "
                >
                  <span>
                    {item.label}
                  </span>

                  {locked && (
                    <span className="text-[10px] text-amber-300 font-bold">
                      {item.href === "/dashboard"
                        ? "(Assessment Required)"
                        : "(Onboarding Required)"}
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
          border-surface-variant
          mt-auto
          flex
          flex-col
          gap-1.5
          shrink-0
        "
      >

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
                transition-colors
                text-sm
                font-medium
                relative
                group

                ${
                  collapsed
                    ? "w-12 h-10 mx-auto justify-center"
                    : "px-4 py-2.5 gap-3"
                }

                ${
                  isActive
                    ? "bg-primary text-white font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }
              `}
            >

              <span
                className={`
                  material-symbols-outlined
                  shrink-0
                  text-[20px]

                  ${
                    isActive
                      ? "fill text-white"
                      : "text-on-surface-variant"
                  }
                `}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <span className="truncate whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {collapsed && (
                <div
                  className="
                    absolute
                    left-full
                    ml-3
                    px-2.5
                    py-1.5
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
            LOGOUT
            ====================================================== */}

        <button
          type="button"
          onClick={() =>
            signOut(() => router.push("/"))
          }
          title={
            collapsed
              ? "Sign Out"
              : undefined
          }
          className={`
            text-error
            font-medium
            rounded-xl
            hover:bg-error-container/20
            transition-colors
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
                : "px-4 py-2.5 gap-3 mt-1"
            }
          `}
        >

          <span className="material-symbols-outlined text-[20px] text-error shrink-0">
            logout
          </span>

          {!collapsed && (
            <span>
              Sign Out
            </span>
          )}

          {collapsed && (
            <div
              className="
                absolute
                left-full
                ml-3
                px-2.5
                py-1.5
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