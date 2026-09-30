"use client";

import { useEffect, useRef, useState } from "react";

export interface SearchSelectOption {
  value: string;
  label: string;
}

/**
 * Searchable single-select restricted to predefined values.
 *
 * Typed text is only ever used to filter the list — it can never be committed
 * as a value, so nothing a user types can reach the database. Used for the
 * geo pickers (country, county, sub-county).
 */
export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  buttonClassName,
  panelClassName,
  inputClassName,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SearchSelectOption[];
  placeholder: string;
  disabled?: boolean;
  buttonClassName?: string;
  panelClassName?: string;
  inputClassName?: string;
  onClear?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const selected = options.find(
    (o) => o.value.toLowerCase() === String(value).toLowerCase()
  );
  const isUnknown = Boolean(value) && !selected;
  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q))
    : options;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setQuery("");
          setOpen((v) => !v);
        }}
        className={
          buttonClassName ||
          "w-full rounded-xl border border-outline-variant px-4 py-2.5 text-left text-sm outline-none focus:border-secondary bg-surface flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        }
      >
        <span
          className={
            selected
              ? "text-on-surface"
              : isUnknown
                ? "text-amber-700"
                : "text-on-surface-variant/50"
          }
        >
          {selected
            ? selected.label
            : isUnknown
              ? `${value} (not in official list)`
              : placeholder}
        </span>
        <span className="text-on-surface-variant text-xs">▼</span>
      </button>
      {open && !disabled && (
        <div
          className={
            panelClassName ||
            "absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-xl"
          }
        >
          <div className="border-b border-outline-variant/40 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className={
                inputClassName ||
                "w-full rounded-lg border border-outline-variant px-3 py-1.5 text-sm outline-none focus:border-secondary bg-surface"
              }
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {onClear && value && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setQuery("");
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm cursor-pointer text-on-surface-variant hover:bg-surface-container-low"
              >
                Clear selection
              </button>
            )}
            {isUnknown && (
              <p className="px-3 py-2 text-sm text-amber-700">
                &ldquo;{value}&rdquo; is not in the official list, so it
                can&rsquo;t be re-saved. Pick one below to replace it.
              </p>
            )}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-on-surface-variant/70">
                No matches.
              </p>
            )}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setQuery("");
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm cursor-pointer hover:bg-surface-container-low ${
                  o.value === value
                    ? "font-semibold text-secondary"
                    : "text-on-surface"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
