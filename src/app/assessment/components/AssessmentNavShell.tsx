"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";

interface AssessmentNavShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  showContextualHeader?: boolean;
}

export default function AssessmentNavShell({
  children,
  headerTitle,
  showContextualHeader = false,
}: AssessmentNavShellProps) {
  return (
    <AppShell>
      {showContextualHeader && headerTitle && (
        <div className="bg-surface border-b border-surface-variant px-4 md:px-8 py-3 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px] fill">
              assignment
            </span>
            <h2 className="font-title-md text-sm md:text-base text-on-surface font-semibold">
              {headerTitle}
            </h2>
          </div>
        </div>
      )}
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </AppShell>
  );
}
