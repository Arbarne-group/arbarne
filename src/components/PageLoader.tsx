"use client";

import React from "react";

/**
 * Shared loading placeholder used with `useApiData` (or manual loading
 * flags), while server truth is loading, pages show this instead of
 * stale cached content.
 */
export default function PageLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-[3px] border-outline-variant/40 border-t-primary animate-spin" />
      <p className="text-sm text-on-surface-variant animate-pulse text-center">{message}</p>
    </div>
  );
}
