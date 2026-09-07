"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export default function AppShell({
  children,
  userName = "Keziah Wanjiku",
  userRole = "Farm Owner",
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("future_farms_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch (e) {
      // Ignore localStorage errors in restricted environments
    }

    // Optional keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((prev) => {
          const next = !prev;
          try {
            localStorage.setItem("future_farms_sidebar_collapsed", String(next));
          } catch (_) {}
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("future_farms_sidebar_collapsed", String(next));
      } catch (_) {}
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-background text-on-background overflow-hidden">
      {/* Desktop Persistent Sidebar with Expand/Collapse */}
      <Sidebar
        userName={userName}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area - Transitions smoothly between ml-64 and ml-20 */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header
          userName={userName}
          userRole={userRole}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <main className="flex-1 overflow-y-auto bg-surface relative pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Nav */}
        <MobileNav />
      </div>
    </div>
  );
}
