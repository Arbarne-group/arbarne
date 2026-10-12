
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appSignOut } from "@/hooks/useAppUser";

const LINKS = [
  { href: "/a/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/a/users", label: "Farmers & Users", icon: "group" },
  { href: "/a/assessments", label: "Assessments", icon: "assignment" },
  { href: "/a/billing", label: "Billing & Payments", icon: "credit_card" },
  { href: "/a/support", label: "Support Centre", icon: "support_agent" },
  { href: "/a/analytics", label: "Reports & Analytics", icon: "insights" },
  { href: "/a/geography", label: "Geography", icon: "public" },
  { href: "/a/audit", label: "Audit Log", icon: "receipt_long" },
  { href: "/a/settings", label: "Admin Settings", icon: "settings" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationContent = (
    <div className="flex min-h-full w-full flex-1 flex-col bg-[#045D61] text-white">
      {/* Logo Header */}
      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-5">
        <Link
          href="/a/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center"
        >
          <Image
            src="/ffi-white-horizontal.png"
            alt="Future Farms Framework"
            width={180}
            height={44}
            priority
            className="h-auto w-[160px] object-contain"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
      >
        {LINKS.map((link) => {
          const active = isActivePath(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                active
                  ? "bg-secondary font-semibold text-white shadow-xs"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined shrink-0 text-[21px]">
                {link.icon}
              </span>

              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Footer */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => appSignOut("/")}
          className="flex w-full cursor-pointer bg-secondary items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white transition-colors hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined text-[21px]">
            logout
          </span>

          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden h-full min-h-full w-full md:flex">
        {navigationContent}
      </div>

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-45 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <Link href="/a/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-[#045D61]">
            Future Farms <span className="font-normal">Admin</span>
          </span>
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="cursor-pointer rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="absolute inset-y-0 left-0 z-10 h-full w-72 max-w-[85vw] shadow-xl">
            {navigationContent}
          </div>
        </div>
      )}
    </>
  );
}
