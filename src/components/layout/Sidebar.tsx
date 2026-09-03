"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userName?: string;
}

export default function Sidebar({ userName = "Keziah" }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/onboarding", icon: "dashboard" },
    { label: "My Farm", href: "/dashboard", icon: "agriculture" },
    { label: "Assessment", href: "/assessment", icon: "fact_check" },
    { label: "Digital Learning", href: "/learning", icon: "school" },
    { label: "Opportunity Desk", href: "/opportunities", icon: "lightbulb" },
    { label: "Service Desk", href: "/service-desk", icon: "support_agent" },
  ];

  const bottomItems = [
    { label: "Help Center", href: "/help", icon: "help" },
    { label: "Contact Us", href: "/contact", icon: "mail" },
  ];

  return (
    <nav className="h-full w-64 fixed left-0 top-0 hidden md:flex flex-col bg-surface-container-lowest border-r border-surface-variant z-40 py-6">
      {/* Brand Header */}
      <div className="px-6 pb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-3xl fill">
          agriculture
        </span>
        <span className="font-bold text-primary text-[24px] tracking-tight leading-tight">
          Future Farms
        </span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/onboarding" && pathname.startsWith("/onboarding"));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-sm ${
                isActive
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? "fill text-white" : "text-on-surface-variant"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav Actions */}
      <div className="p-4 border-t border-surface-variant mt-auto flex flex-col gap-1.5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-3 text-sm ${
                isActive
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? "fill text-white" : "text-on-surface-variant"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/login"
          className="text-error font-medium px-4 py-2.5 rounded-xl hover:bg-error-container/20 transition-colors flex items-center gap-3 text-sm mt-1"
        >
          <span className="material-symbols-outlined text-[20px] text-error">logout</span>
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
