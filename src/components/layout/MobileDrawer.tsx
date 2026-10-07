"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appSignOut } from "@/hooks/useAppUser";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  ffvBadge?: string | null;
}

const MAIN_ITEMS = [
  { label: "Business Profile", href: "/overview", icon: "dashboard" },
  { label: "My Future Farm", href: "/dashboard", icon: "agriculture" },
  { label: "FFMI / 24", href: "/assessment", icon: "fact_check" },
  { label: "FFV", href: "/ffv", icon: "verified", badgeKey: "ffv" },
  { label: "Digital Learning", href: "/learning", icon: "school" },
  { label: "Opportunity Desk", href: "/opportunities", icon: "lightbulb" },
  { label: "Solutions Hub", href: "/service-desk", icon: "handyman" },
  { label: "Referrals", href: "/referrals", icon: "group_add" },
  { label: "Pricing", href: "/pricing", icon: "payments" },
];

const BOTTOM_ITEMS = [
  { label: "Support", href: "/support", icon: "support_agent" },
  { label: "System Navigation", href: "/help", icon: "help" },
];

export default function MobileDrawer({
  open,
  onClose,
  userName = "Farmer",
  userEmail = "",
  ffvBadge = null,
}: MobileDrawerProps) {
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/assessment" && pathname.startsWith("/assessment"));

  const itemCls = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors active:scale-[0.99] ${
      isActive(href)
        ? "bg-primary text-on-primary shadow-md"
        : "text-on-surface hover:bg-surface-container-high"
    }`;

  return (
    <div
      className={`fixed inset-0 z-[70] md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-on-surface/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`absolute left-0 top-0 h-full w-[84vw] max-w-[320px] bg-surface shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Menu"
      >
        {/* User block */}
        <div className="relative overflow-hidden bg-primary px-5 pt-6 pb-5 shrink-0">
          <div className="absolute -right-10 -top-14 w-44 h-44 rounded-full bg-on-primary/10 pointer-events-none" />
          <div className="absolute right-10 -bottom-16 w-32 h-32 rounded-full bg-on-primary/[0.07] pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-on-primary text-primary text-base font-black shrink-0">
              {(userName || userEmail || "F").trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-on-primary font-bold text-[15px] truncate">
                {userName}
              </p>
              {userEmail ? (
                <p className="text-on-primary/70 text-xs truncate">{userEmail}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MAIN_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={itemCls(item.href)}
              tabIndex={open ? undefined : -1}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive(item.href) ? "" : "text-primary"
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badgeKey === "ffv" && ffvBadge ? (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30">
                  {ffvBadge}
                </span>
              ) : null}
              <span className="material-symbols-outlined text-[18px] opacity-40">
                chevron_right
              </span>
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-outline-variant/40 space-y-1">
            {BOTTOM_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={itemCls(item.href)}
                tabIndex={open ? undefined : -1}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive(item.href) ? "" : "text-primary"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                <span className="material-symbols-outlined text-[18px] opacity-40">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-outline-variant/40 shrink-0">
          <button
            type="button"
            onClick={() => appSignOut("/")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-error hover:bg-error/10 transition-colors cursor-pointer"
            tabIndex={open ? undefined : -1}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
}
