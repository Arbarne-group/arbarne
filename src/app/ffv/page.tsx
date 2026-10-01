"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";
import { useAppUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import { ALL_PILLARS } from "@/data/assessmentData";

type EvidenceMedia = {
  id: string;
  fileName: string;
  fileType?: string | null;
  fileSize?: number | null;
  createdAt?: string;
};

type EvidenceRecord = {
  questionId: string;
  status: string;
  fileName?: string | null;
  notes?: string | null;
  updatedAt?: string;
  media?: EvidenceMedia[];
};

const STATUS_META: Record<string, { label: string; pill: string }> = {
  not_submitted: {
    label: "Not Submitted",
    pill: "bg-surface-variant text-on-surface-variant border border-outline-variant",
  },
  submitted: {
    label: "Submitted",
    pill: "bg-blue-600/10 text-blue-700 border border-blue-600/25",
  },
  verified: {
    label: "Verified",
    pill: "bg-primary/10 text-primary border border-primary/25",
  },
  needs_review: {
    label: "Needs Review",
    pill: "bg-amber-500/10 text-amber-700 border border-amber-500/30",
  },
};

function statusOf(evidence: Record<string, EvidenceRecord>, qid: string): string {
  const st = (evidence[qid]?.status || "not_submitted").toLowerCase();
  if (st === "verified") return "verified";
  if (st === "needs_review" || st === "need_review" || st === "needs review")
    return "needs_review";
  if (st === "submitted") return "submitted";
  return "not_submitted";
}

export default function FfvPage() {
  const { user, isLoaded } = useAppUser();
  const email = user?.primaryEmailAddress?.emailAddress || user?.email || "";
  const [answers, setAnswers] = useState<Record<string, "yes" | "no"> | null>(null);
  const [evidence, setEvidence] = useState<Record<string, EvidenceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  // Staged files per question, keyed by stable row id so removing a row
  // never misaligns the remaining file inputs. + appends rows up to the
  // per-question maximum minus already-uploaded media.
  const [staged, setStaged] = useState<Record<string, Record<string, File>>>({});
  const [fieldIds, setFieldIds] = useState<Record<string, string[]>>({});
  const [formNonce, setFormNonce] = useState(0);

  function rowIds(questionId: string): string[] {
    return fieldIds[questionId] || ["f0"];
  }

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    (async () => {
      // Resolved inside the async flow: on a fresh OAuth login the cached
      // email does not exist on first paint.
      const em = email || getActiveUserEmail();
      if (!em) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const [resRes, evRes] = await Promise.all([
          fetch(`/api/assessment/responses?email=${encodeURIComponent(em)}`, { cache: "no-store" }),
          fetch(`/api/assessment/evidence?email=${encodeURIComponent(em)}`, { cache: "no-store" }),
        ]);
        const resData = await resRes.json().catch(() => ({}));
        const evData = await evRes.json().catch(() => ({}));
        if (cancelled) return;
        setAnswers(resData?.answers && typeof resData.answers === "object" ? resData.answers : {});
        const map: Record<string, EvidenceRecord> = {};
        for (const e of evData?.evidences || []) map[e.questionId] = e;
        setEvidence(map);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, email]);

  // YES answers that carry verification guidance, grouped for display.
  const required = useMemo(() => {
    if (!answers) return [];
    const groups: Array<{
      pillarId: number;
      pillarName: string;
      capabilityId: string;
      capabilityName: string;
      items: Array<{
        questionId: string;
        text: string;
        why: string;
        guidance: string;
        allowed: string[];
      }>;
    }> = [];
    for (const pillar of ALL_PILLARS) {
      for (const cap of pillar.capabilities) {
        const items = cap.questions
          // Only questions flagged as needing verification appear here.
          .filter((q) => answers[q.id] === "yes" && q.requiresVerification !== false)
          .map((q) => ({
            questionId: q.id,
            text: q.question_text,
            why: q.why_it_matters || "",
            guidance: q.ffv_evidence_required || "",
            allowed:
              Array.isArray(q.allowedEvidenceTypes) && q.allowedEvidenceTypes.length > 0
                ? q.allowedEvidenceTypes.map(String)
                : ["image", "document"],
          }));
        if (items.length > 0) {
          groups.push({
            pillarId: pillar.id,
            pillarName: pillar.name,
            capabilityId: cap.id,
            capabilityName: cap.name,
            items,
          });
        }
      }
    }
    return groups;
  }, [answers]);

  const MAX_FILES = 5;

  function acceptFor(allowed: string[]): string {
    const parts: string[] = [];
    if (allowed.includes("image")) parts.push(".png,.jpg,.jpeg");
    if (allowed.includes("document")) parts.push(".pdf");
    return parts.join(",") || ".png,.jpg,.jpeg,.pdf";
  }

  function typeHint(allowed: string[]): string {
    const hasImage = allowed.includes("image");
    const hasDoc = allowed.includes("document");
    if (hasImage && hasDoc) return "Photos or PDF documents (max 5 files)";
    if (hasDoc) return "Documents only (PDF) (max 5 files)";
    return "Photos only (PNG/JPG) (max 5 files)";
  }

  const counts = useMemo(() => {
    const c = { not_submitted: 0, submitted: 0, verified: 0, needs_review: 0 };
    for (const g of required) {
      for (const it of g.items) c[statusOf(evidence, it.questionId) as keyof typeof c] += 1;
    }
    return c;
  }, [required, evidence]);

  const totalYes = Object.values(answers || {}).filter((a) => a === "yes").length;
  const hasAnswers = totalYes > 0 || Object.keys(answers || {}).length > 0;

  // Filter verifications by review status.
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const visibleGroups = useMemo(
    () =>
      required
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (it) => statusFilter === "all" || statusOf(evidence, it.questionId) === statusFilter
          ),
        }))
        .filter((g) => g.items.length > 0),
    [required, evidence, statusFilter]
  );
  const visibleCount = useMemo(
    () => visibleGroups.reduce((n, g) => n + g.items.length, 0),
    [visibleGroups]
  );

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function setStagedFile(questionId: string, rowId: string, file: File | null) {
    setStaged((prev) => {
      const rec = { ...(prev[questionId] || {}) };
      if (file) rec[rowId] = file;
      else delete rec[rowId];
      return { ...prev, [questionId]: rec };
    });
  }

  function removeField(questionId: string, rowId: string) {
    setStagedFile(questionId, rowId, null);
    setFieldIds((prev) => {
      const ids = (prev[questionId] || ["f0"]).filter((id) => id !== rowId);
      return { ...prev, [questionId]: ids.length > 0 ? ids : ["f0"] };
    });
  }

  async function handleUpload(questionId: string, pillarId: number, capabilityId: string) {
    const ids = rowIds(questionId);
    const rec = staged[questionId] || {};
    const files = ids.map((id) => rec[id]).filter((f): f is File => Boolean(f));
    const em = email || getActiveUserEmail();
    setUploadError(null);
    if (files.length === 0) {
      setUploadError("Choose at least one file first. Tap + to add more (up to 5).");
      return;
    }
    const oversize = files.find((f) => f.size > 10 * 1024 * 1024);
    if (oversize) {
      setUploadError(`"${oversize.name}" is over the 10MB limit.`);
      return;
    }
    setUploadingId(questionId);
    try {
      const payload = [];
      for (const f of files) {
        payload.push({
          fileName: f.name,
          fileType: f.type,
          fileSize: f.size,
          fileData: await readFile(f),
        });
      }
      const res = await fetch("/api/assessment/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          pillarId,
          capabilityId,
          questionId,
          evidenceType: "digital",
          files: payload,
          notes: notes[questionId]?.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Upload failed.");
      const media: EvidenceMedia[] = (data?.evidence?.media || []).map((m: any) => ({
        id: m.id,
        fileName: m.fileName,
        fileType: m.fileType,
        fileSize: m.fileSize,
        createdAt: m.createdAt,
      }));
      setEvidence((prev) => ({
        ...prev,
        [questionId]: {
          questionId,
          status: data?.evidence?.status || "submitted",
          fileName: media[media.length - 1]?.fileName || prev[questionId]?.fileName || null,
          notes: notes[questionId]?.trim() || prev[questionId]?.notes || null,
          media,
        },
      }));
      setStaged((prev) => ({ ...prev, [questionId]: {} }));
      setFieldIds((prev) => ({ ...prev, [questionId]: ["f0"] }));
      setFormNonce((n) => n + 1);
    } catch (e: any) {
      setUploadError(e?.message || "Upload failed. Please try again.");
    } finally {
      setUploadingId(null);
    }
  }

  async function handleDeleteMedia(questionId: string, mediaId: string) {
    const em = email || getActiveUserEmail();
    setUploadError(null);
    try {
      const res = await fetch(
        `/api/assessment/evidence/media/${encodeURIComponent(mediaId)}?email=${encodeURIComponent(em)}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not delete the file.");
      setEvidence((prev) => {
        const rec = prev[questionId];
        if (!rec) return prev;
        return {
          ...prev,
          [questionId]: {
            ...rec,
            media: (rec.media || []).filter((m) => m.id !== mediaId),
          },
        };
      });
    } catch (e: any) {
      setUploadError(e?.message || "Could not delete the file.");
    }
  }

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #045D6114 0%, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-8 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#045D61" }}>
                verified
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                FFV — Verify Your Progress
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Ready to prove your farm&rsquo;s capabilities?
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Return here to verify your progress and build a more credible farm
                profile through Future Farms Verification (FFV).
              </p>
            </div>
          </div>
        </div>

        {/* {loading ? (
          <PageLoader message="Loading your verification checklist…" />
        ) : !hasAnswers ? (
          <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-8 md:p-10 text-center space-y-4">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
            >
              <span className="material-symbols-outlined text-[34px]" style={{ color: "#045D61" }}>
                fact_check
              </span>
            </div>
            <h2 className="text-lg font-bold text-on-surface">No assessment answers yet</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Complete your FFMI/24 assessment first. Every YES answer then
              appears here with exactly what to upload to verify it.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold"
            >
              Start the assessment
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                [
                  ["not_submitted", counts.not_submitted],
                  ["submitted", counts.submitted],
                  ["verified", counts.verified],
                  ["needs_review", counts.needs_review],
                ] as const
              ).map(([key, n]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 p-4 text-center"
                >
                  <div className="text-2xl font-bold text-on-surface">{n}</div>
                  <div
                    className={`inline-block mt-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_META[key].pill}`}
                  >
                    {STATUS_META[key].label}
                  </div>
                </div>
              ))}
            </div>

            {uploadError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {uploadError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="ffv-status-filter" className="text-sm font-bold text-on-surface shrink-0">
                Filter by status
              </label>
              <select
                id="ffv-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface outline-none focus:border-primary"
              >
                <option value="all">All statuses ({required.reduce((n, g) => n + g.items.length, 0)})</option>
                {(
                  [
                    ["not_submitted", counts.not_submitted],
                    ["submitted", counts.submitted],
                    ["verified", counts.verified],
                    ["needs_review", counts.needs_review],
                  ] as const
                ).map(([key, n]) => (
                  <option key={key} value={key}>
                    {STATUS_META[key].label} ({n})
                  </option>
                ))}
              </select>
              {statusFilter !== "all" && (
                <span className="text-xs text-on-surface-variant">
                  Showing {visibleCount} of {required.reduce((n, g) => n + g.items.length, 0)}
                </span>
              )}
            </div>

            <div className="space-y-10">
              {visibleGroups.length === 0 ? (
                <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
                  No verifications with this status. Change the filter above.
                </p>
              ) : null}
              {visibleGroups.map((g) => (
                <section key={`${g.pillarId}-${g.capabilityId}`} aria-label={g.capabilityName}>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                      Pillar {g.pillarId} • Capability {g.capabilityId.replace("P", "")} • {g.capabilityName}
                    </p>
                    <div className="h-px bg-outline-variant/40" />
                  </div>
                  <div className="space-y-5">
                    {g.items.map((it) => {
                      const st = statusOf(evidence, it.questionId);
                      const rec = evidence[it.questionId];
                      const meta = STATUS_META[st];
                      return (
                        <div
                          key={it.questionId}
                          className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 p-5 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-[15px] text-on-surface">
                              {it.text}
                            </h3>
                            <span
                              className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${meta.pill}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          {it.why && (
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              <strong className="text-on-surface">Why we ask:</strong> {it.why}
                            </p>
                          )}
                          {it.guidance && (
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              <strong className="text-on-surface">What to upload:</strong> {it.guidance}
                            </p>
                          )}

                          {st === "needs_review" && rec?.notes && (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm space-y-1.5">
                              <p className="font-bold text-amber-800">Needs Review</p>
                              <p className="text-amber-900/90">{rec.notes}</p>
                              <p className="text-amber-900/90">
                                <strong>What you can do:</strong> upload clearer
                                media addressing the note above. This is a
                                chance to strengthen your evidence, not a penalty.
                              </p>
                            </div>
                          )}

                          {(rec?.media || []).length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Uploaded files ({rec?.media?.length}/{MAX_FILES})
                              </p>
                              {(rec?.media || []).map((m) => (
                                <div
                                  key={m.id}
                                  className="flex items-center justify-between gap-2 rounded-xl border border-outline-variant/40 bg-surface-container px-3 py-2 text-sm"
                                >
                                  <span className="min-w-0">
                                    <span className="font-semibold text-on-surface truncate block">
                                      {m.fileName}
                                    </span>
                                    <span className="text-xs text-on-surface-variant">
                                      {m.fileSize ? `${(m.fileSize / 1024).toFixed(0)} KB • ` : ""}
                                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}
                                    </span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMedia(it.questionId, m.id)}
                                    aria-label={`Remove ${m.fileName}`}
                                    className="shrink-0 w-8 h-8 rounded-full text-on-surface-variant hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {(() => {
                            const uploaded = (rec?.media || []).length;
                            const ids = rowIds(it.questionId);
                            const rows = ids.slice(0, Math.max(MAX_FILES - uploaded, 1));
                            const canAdd = uploaded + rows.length < MAX_FILES;
                            return (
                              <div className="space-y-2">
                                <p className="text-xs text-on-surface-variant">
                                  {typeHint(it.allowed)}
                                </p>
                                {rows.map((rid) => {
                                  const chosen = (staged[it.questionId] || {})[rid];
                                  return (
                                    <div key={`${formNonce}-${rid}`} className="flex items-center gap-2">
                                      <input
                                        type="file"
                                        accept={acceptFor(it.allowed)}
                                        onChange={(e) =>
                                          setStagedFile(it.questionId, rid, e.target.files?.[0] || null)
                                        }
                                        className="flex-1 min-w-0 text-sm text-on-surface-variant file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-xs file:font-bold file:cursor-pointer"
                                      />
                                      {chosen && (
                                        <span className="hidden sm:block text-xs text-on-surface-variant truncate max-w-40">
                                          {chosen.name}
                                        </span>
                                      )}
                                      {rows.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeField(it.questionId, rid)}
                                          aria-label="Remove this file field"
                                          title="Remove this file field"
                                          className="shrink-0 w-8 h-8 rounded-full text-on-surface-variant hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                                <div className="flex flex-col sm:flex-row gap-2">
                                  {canAdd && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFieldIds((prev) => {
                                          const cur = prev[it.questionId] || ["f0"];
                                          if (cur.length + uploaded >= MAX_FILES) return prev;
                                          return {
                                            ...prev,
                                            [it.questionId]: [...cur, `f${Date.now()}`],
                                          };
                                        })
                                      }
                                      className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-outline-variant text-sm font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">add</span>
                                      Add another file
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    disabled={uploadingId === it.questionId}
                                    onClick={() => handleUpload(it.questionId, g.pillarId, g.capabilityId)}
                                    className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-60 cursor-pointer"
                                  >
                                    {uploadingId === it.questionId
                                      ? "Uploading…"
                                      : uploaded > 0
                                        ? "Upload more evidence"
                                        : "Upload evidence"}
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                          <input
                            value={notes[it.questionId] || ""}
                            onChange={(e) =>
                              setNotes((prev) => ({ ...prev, [it.questionId]: e.target.value }))
                            }
                            placeholder="Add a note about this evidence (optional)"
                            className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface"
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </>
        )} */}
      </div>
    </AppShell>
  );
}
