"use client";

import { GeographyTab } from "@/components/admin/AdminTabs";

export default function AdminGeographyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-on-surface md:text-2xl">Geography</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Countries → counties / provinces → sub-counties → towns.
        </p>
      </div>
      <GeographyTab />
    </div>
  );
}
