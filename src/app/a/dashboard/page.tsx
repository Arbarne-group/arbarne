"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()).catch(() => ({})),
      fetch("/api/geo/countries").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/audit?take=5").then((r) => r.json()).catch(() => ({})),
    ]).then(([u, g, a]) => {
      const users = u.users || [];
      setStats({
        totalUsers: users.length,
        online: users.filter((x: any) => x.online).length,
        staff: users.filter((x: any) =>
          ["FFDeveloper", "FFAdmin", "FFStaff"].includes(x.role)
        ).length,
        farmers: users.filter((x: any) =>
          ["FFFarmer", "FFFarmManager"].includes(x.role)
        ).length,
        countries: (g.countries || []).length,
        recent: a.logs || [],
      });
    });
  }, []);

  const cards = stats
    ? [
        { label: "Total users", value: stats.totalUsers, icon: "group", href: "/a/users" },
        { label: "Online now", value: stats.online, icon: "wifi", href: "/a/users" },
        { label: "Staff", value: stats.staff, icon: "shield_person", href: "/a/users" },
        { label: "Farmers", value: stats.farmers, icon: "agriculture", href: "/a/users" },
        { label: "Countries", value: stats.countries, icon: "public", href: "/a/geography" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-on-surface md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Platform at a glance — jump into users, geography, or the audit trail.
        </p>
      </div>

      {!stats ? (
        <p className="text-sm text-on-surface-variant">Loading overview…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-2xl border border-outline-variant/40 bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="material-symbols-outlined text-2xl text-primary">
                  {c.icon}
                </span>
                <p className="mt-2 text-2xl font-black text-on-surface">{c.value}</p>
                <p className="text-xs font-semibold text-on-surface-variant">{c.label}</p>
              </Link>
            ))}
          </div>

          <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-on-surface">Latest audit activity</h2>
              <Link href="/a/audit" className="text-xs font-bold text-primary hover:underline">
                View all →
              </Link>
            </div>
            {stats.recent.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No audit entries yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.recent.map((l: any) => (
                  <div key={l.id} className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-bold ${
                        l.action === "DELETE"
                          ? "bg-red-100 text-red-800"
                          : l.action === "CREATE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {l.action}
                    </span>
                    <span className="font-bold text-on-surface">{l.model}</span>
                    <span className="text-on-surface-variant">
                      by {l.actor ? l.actor.email || l.actor.name : "system"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
