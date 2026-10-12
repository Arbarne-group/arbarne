"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dashboard } from "@/components/admin/Dashboard";

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
    

    <>
    <Dashboard/>
    </>
  );
}
