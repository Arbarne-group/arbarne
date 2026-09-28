"use client";

import { UsersTab } from "@/components/admin/AdminTabs";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-on-surface md:text-2xl">Users & Invites</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Presence, roles, and staff invitations.
        </p>
      </div>
      <UsersTab />
    </div>
  );
}
