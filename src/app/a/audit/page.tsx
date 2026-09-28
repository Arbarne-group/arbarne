"use client";

import { AuditTab } from "@/components/admin/AdminTabs";

export default function AdminAuditPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-on-surface md:text-2xl">Audit Log</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every change, by whom, and when — newest first.
        </p>
      </div>
      <AuditTab />
    </div>
  );
}
