"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AssessmentNavShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  showContextualHeader?: boolean;
}

export default function AssessmentNavShell({
  children,
  headerTitle = "Pillar 2: Productive Use of Renewable Energy",
  showContextualHeader = false,
}: AssessmentNavShellProps) {
  const pathname = usePathname();

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile TopNavBar */}
      <header className="md:hidden bg-surface flex justify-between items-center w-full px-margin-mobile h-16 z-50 sticky top-0 shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">
            agriculture
          </span>
          <span className="font-display-lg text-headline-lg-mobile font-bold text-primary tracking-tight">
            FUTURE FARMS
          </span>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button className="hover:text-primary transition-colors opacity-80" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:text-primary transition-colors opacity-80" aria-label="Mail">
            <span className="material-symbols-outlined">mail</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container overflow-hidden flex items-center justify-center font-bold text-xs">
            KW
          </div>
        </div>
      </header>

      {/* Desktop SideNavBar */}
      <nav className="hidden md:flex bg-surface flex-col h-screen w-64 border-r border-outline-variant fixed left-0 top-0 z-40 py-md">
        <div className="px-6 mb-8 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              agriculture
            </span>
          </div>
          <div className="font-headline-lg text-headline-lg font-black tracking-tight text-primary uppercase">
            Future Farms
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Sustainable AgTech
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-sm text-label-sm">Overview</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">agriculture</span>
            <span className="font-label-sm text-label-sm">My Farm</span>
          </Link>
          <Link
            href="/assessment"
            className="flex items-center gap-3 px-4 py-3 bg-primary text-white font-semibold rounded-xl mx-2 my-1 transition-colors"
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              assignment
            </span>
            <span className="font-label-sm text-label-sm">Assessment</span>
          </Link>
          <Link
            href="/learning"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">school</span>
            <span className="font-label-sm text-label-sm">Digital Learning</span>
          </Link>
          <Link
            href="/opportunities"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">lightbulb</span>
            <span className="font-label-sm text-label-sm">Opportunity Desk</span>
          </Link>
          <Link
            href="/service-desk"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">support_agent</span>
            <span className="font-label-sm text-label-sm">Service Desk</span>
          </Link>
        </div>

        <div className="mt-auto px-2 pt-4 border-t border-outline-variant flex flex-col gap-1">
          <Link
            href="/help"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-sm text-label-sm">Help Center</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1"
          >
            <span className="material-symbols-outlined">mail</span>
            <span className="font-label-sm text-label-sm">Contact Us</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg mx-2 my-1 mt-2"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-sm text-label-sm">Logout</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Desktop Header */}
        {showContextualHeader ? (
          <header className="bg-surface hidden md:flex justify-between items-center w-full px-margin-desktop h-16 z-30 sticky top-0 border-b border-surface-container-high">
            <h2 className="font-title-md text-title-md text-on-surface font-medium">
              {headerTitle}
            </h2>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
                notifications
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
                mail
              </span>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-container-high p-1 pr-3 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container overflow-hidden flex items-center justify-center font-bold text-sm">
                  KW
                </div>
                <span className="font-label-sm text-label-sm">Hello, Keziah</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
          </header>
        ) : (
          <div className="hidden md:flex justify-end items-center gap-6 w-full max-w-[1280px] mx-auto pt-6 px-margin-desktop">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
                notifications
              </span>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-container-high p-1 pr-3 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container overflow-hidden flex items-center justify-center font-bold text-sm">
                  KW
                </div>
                <span className="font-label-sm text-label-sm">Hello, Keziah</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">{children}</div>
      </div>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden bg-surface w-full h-16 fixed bottom-0 left-0 z-50 flex justify-around items-center px-2 border-t border-outline-variant/30">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mb-1 text-[24px]">home</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mb-1 text-[24px]">dashboard</span>
        </Link>
        <Link
          href="/assessment"
          className="flex flex-col items-center justify-center w-full h-full text-primary font-bold"
        >
          <span
            className="material-symbols-outlined mb-1 text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            assignment
          </span>
        </Link>
        <Link
          href="/learning"
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mb-1 text-[24px]">school</span>
        </Link>
        <Link
          href="/help"
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mb-1 text-[24px]">more_horiz</span>
        </Link>
      </nav>
    </div>
  );
}
