"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/onboarding", icon: "dashboard" },
    { label: "My Farm", href: "/dashboard", icon: "agriculture" },
    { label: "Assess", href: "/assessment", icon: "fact_check", highlight: true },
    { label: "Learn", href: "/learning", icon: "school" },
    { label: "Opps", href: "/opportunities", icon: "lightbulb" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-surface-variant shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/onboarding" && pathname.startsWith("/onboarding"));

        if (item.highlight) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-xl px-3 py-1.5 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px] fill">
                {item.icon}
              </span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive ? "fill" : ""
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
