"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appSignOut } from "@/hooks/useAppUser";

const LINKS = [
  { href: "/a/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/a/users", label: "Users & Invites", icon: "group" },
  { href: "/a/geography", label: "Geography", icon: "public" },
  { href: "/a/audit", label: "Audit Log", icon: "receipt_long" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 rounded-xl transition-all duration-200 text-sm font-medium relative shrink-0 ${
      active
        ? "bg-secondary text-white font-semibold shadow-sm"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile top rail */}
      <nav className="flex w-full items-center gap-1.5 overflow-x-auto bg-primary px-3 py-2.5 md:hidden shrink-0 no-print print:hidden">
        <span className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-xs font-black text-white shrink-0">
          FF
        </span>
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                active ? "bg-secondary text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Desktop rail (mirrors the main app sidebar) */}
      <nav className="h-screen sticky top-0 hidden md:flex flex-col w-64 z-40 select-none bg-primary text-on-primary border-r border-white/10 transition-all shrink-0 no-print print:hidden">
        <div className="h-20 min-h-20 flex items-center px-3.5 border-b border-white/10 shrink-0">
          <Link
            href="/a/dashboard"
            className="flex items-center gap-2.5 pl-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Future Farms Admin"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-black text-white shrink-0">
              FF
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white leading-tight">FF ADMIN</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                Control center
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto py-5 px-3 flex flex-col gap-1.5 bg-primary">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link key={l.href} href={l.href} className={`${linkCls(active)} px-3.5 py-3 gap-3`}>
                <span
                  className={`material-symbols-outlined shrink-0 text-[20px] transition-colors ${
                    active ? "fill text-white" : "text-white/85"
                  }`}
                >
                  {l.icon}
                </span>
                <span className="truncate whitespace-nowrap">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-white/10 mt-auto flex flex-col gap-1.5 shrink-0 bg-primary">
          <Link
            href="/overview"
            className="rounded-xl flex items-center text-sm font-medium transition-all duration-200 text-white/85 hover:bg-white/10 hover:text-white px-3.5 py-2.5 gap-3"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0 text-white/85">
              storefront
            </span>
            <span className="truncate whitespace-nowrap">View site</span>
          </Link>
          <button
            type="button"
            onClick={() => appSignOut("/")}
            className="rounded-xl bg-secondary hover:bg-secondary/50 hover:text-white transition-all duration-200 flex items-center text-sm text-white font-medium px-3.5 py-2.5 gap-3 mt-0.5 cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px] text-white shrink-0">
              logout
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
