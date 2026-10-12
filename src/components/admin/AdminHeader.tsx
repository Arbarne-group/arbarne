
"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/a/dashboard": "Dashboard",
  "/a/users": "Farmers & Users",
  "/a/assessments": "Assessment Management",
  "/a/billing": "Billing & Payments",
  "/a/support": "Support Centre",
  "/a/analytics": "Reports & Analytics",
  "/a/geography": "Geography",
  "/a/audit": "Audit Log",
  "/a/settings": "Admin Settings",
};

export default function AdminHeader() {
  const pathname = usePathname();

  const title =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(`${path}/`)
    )?.[1] ??
    "Admin Portal";

  return (
    <header className="sticky top-0 z-30 hidden h-20 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-8 backdrop-blur md:flex">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Future Farms Framework
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-gray-500">
          notifications
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#045D61] text-sm font-bold text-white">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Administrator</p>
          <p className="text-xs text-gray-500">Admin account</p>
        </div>
      </div>
    </header>
  );
}
