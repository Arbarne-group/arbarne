"use client";

import { Users } from "@/components/admin/Users";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-outline-variant/30 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-secondary md:text-3xl">
          User Management
        </h1>
        <p className="text-md text-on-surface-variant">
          Monitor registered accounts, business profiles, system access, and details.
        </p>
      </div>

      {/* Main Users Component */}
      <Users />
    </div>
  );
}