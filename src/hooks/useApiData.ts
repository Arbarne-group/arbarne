"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global data-loading primitive Pages gate their content on `isLoading` so users
 * never see stale data flash and then change seconds later.
 */
export function useApiData<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    if (!url) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    fetch(url, { cache: "no-store" })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load data.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url, version]);

  return { data, isLoading, error, refetch };
}
