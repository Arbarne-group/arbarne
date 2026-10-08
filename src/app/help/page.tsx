"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { HELP_ARTICLES } from "@/data/helpArticles";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState<string>(HELP_ARTICLES[0]?.slug ?? "");
  const articleRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return HELP_ARTICLES;
    return HELP_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.join(" ").toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Track the article in view to highlight the left nav (desktop wiki).
  useEffect(() => {
    if (filtered.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id.replace(/^help-/, ""));
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    const els = filtered
      .map((a) => articleRefs.current[a.slug])
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  const jumpTo = (slug: string) => {
    setActiveSlug(slug);
    articleRefs.current[slug]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8 pb-24">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 mb-6 md:mb-8">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #045D6114 0%, transparent 60%)" }}
          />
          <div className="relative max-w-2xl mx-auto space-y-4 p-6 md:p-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#045D61" }}>
                help
              </span>
            </div>
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Help Center — System Navigation
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
              How to use Future Farms
            </h1>
            <p className="text-sm md:text-[15px] text-on-surface-variant">
              What each page contains and how to navigate the system, section by
              section. Search or pick a guide — every article links straight
              to its page.
            </p>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the guide…"
              className="w-full max-w-md mx-auto rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface-container-lowest outline-none focus:border-primary"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center rounded-2xl border border-dashed border-outline-variant p-6 max-w-3xl mx-auto">
            Nothing matches “{searchQuery}”. Try “assessment”, “ticket” or “verification”.
          </p>
        ) : (
          <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 items-start">
            {/* Left: section index (desktop sticky) */}
            <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface shadow-level-1 p-3">
              <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                On this page
              </p>
              <nav className="space-y-0.5">
                {filtered.map((a) => {
                  const active = activeSlug === a.slug;
                  return (
                    <button
                      key={a.slug}
                      type="button"
                      onClick={() => jumpTo(a.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2 ${
                        active
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium"
                      }`}
                    >
                      <span
                        className={`w-1 self-stretch rounded-full shrink-0 ${
                          active ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      <span className="truncate">{a.title}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Mobile: horizontal chip index */}
            <div
              ref={navRef}
              className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-2 -mx-4 px-4"
            >
              {filtered.map((a) => (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => jumpTo(a.slug)}
                  className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    activeSlug === a.slug
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface text-on-surface-variant border-outline-variant/60"
                  }`}
                >
                  {a.title}
                </button>
              ))}
            </div>

            {/* Right: articles, newspaper reading measure */}
            <div className="space-y-6 md:space-y-8 min-w-0">
              {filtered.map((a, i) => (
                <article
                  key={a.slug}
                  id={`help-${a.slug}`}
                  ref={(el) => {
                    articleRefs.current[a.slug] = el;
                  }}
                  className="scroll-mt-24 rounded-3xl border border-outline-variant/40 bg-surface shadow-level-1 overflow-hidden"
                >
                  <div className="p-6 md:p-8 max-w-[68ch]">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                        Guide {String(i + 1).padStart(2, "0")}
                      </p>
                      {a.updatedAt && (
                        <p className="text-[11px] text-on-surface-variant shrink-0">
                          Updated {a.updatedAt}
                        </p>
                      )}
                    </div>
                    <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-1">
                      {a.title}
                    </h2>
                    {a.image && (
                      <div className="relative mt-4 rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-low">
                        <Image
                          src={a.image}
                          alt={a.imageAlt || a.title}
                          width={1200}
                          height={675}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    <div className="mt-3 space-y-3">
                      {a.body.map((p, j) => (
                        <p
                          key={j}
                          className="text-[15px] md:text-base text-on-surface-variant leading-relaxed"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                    <Link
                      href={a.href}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      Open {a.title.split("(")[0].trim()}
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </article>
              ))}

              <p className="text-center text-sm text-on-surface-variant pt-2">
                Still stuck?{" "}
                <Link href="/support" className="font-bold text-primary">
                  Open a support ticket
                </Link>{" "}
                and the team will help.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
