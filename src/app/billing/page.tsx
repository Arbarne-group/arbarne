"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function BillingPortalPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Phone editing state for factual M-Pesa mobile money profile
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneSaving, setPhoneSaving] = useState(false);

  const activeEmail = user?.primaryEmailAddress?.emailAddress || getActiveUserEmail();

  const fetchBillingData = () => {
    setLoading(true);
    fetch(`/api/billing/subscription?email=${encodeURIComponent(activeEmail)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
          if (resData.user?.phone) {
            setPhoneInput(resData.user.phone);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBillingData();
  }, [activeEmail]);

  // Read registered phone from database user or local storage fallback
  const registeredPhone =
    data?.user?.phone ||
    (typeof window !== "undefined"
      ? (() => {
          try {
            const raw = localStorage.getItem("future_farms_user");
            if (raw) {
              const parsed = JSON.parse(raw);
              return parsed.phone || null;
            }
          } catch {}
          return null;
        })()
      : null);

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      setFeedback({ type: "error", msg: "Please enter a valid Safaricom M-Pesa mobile number." });
      return;
    }
    setPhoneSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_phone",
          email: activeEmail,
          phone: phoneInput.trim(),
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: "success", msg: "M-Pesa phone number updated successfully." });
        setIsEditingPhone(false);
        // Also sync local storage
        try {
          const raw = localStorage.getItem("future_farms_user");
          const parsed = raw ? JSON.parse(raw) : {};
          parsed.phone = phoneInput.trim();
          localStorage.setItem("future_farms_user", JSON.stringify(parsed));
        } catch {}
        fetchBillingData();
      } else {
        setFeedback({ type: "error", msg: resData.error || "Failed to update phone number." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error occurred." });
    } finally {
      setPhoneSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your recurring subscription? You will still retain access until the end of your billing cycle."
      )
    ) {
      return;
    }
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", email: activeEmail }),
      });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: "success", msg: "Subscription cancelled successfully." });
        fetchBillingData();
      } else {
        setFeedback({ type: "error", msg: resData.error || "Failed to cancel subscription." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error occurred." });
    } finally {
      setActionLoading(false);
    }
  };

  const sub = data?.subscription;
  const orders = data?.orders || [];
  const farmName = data?.user?.farmName || null;

  const scrollToPlans = () => {
    const el = document.getElementById("available-plans");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-10 flex-1">
        {/* Header & Quick Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-high pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1 font-semibold">
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-on-surface">Billing &amp; Subscriptions</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
              Billing &amp; Subscription Portal
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              {farmName ? (
                <>
                  Factual subscription status and M-Pesa payment records for{" "}
                  <strong className="text-on-surface">{farmName}</strong>.
                </>
              ) : (
                "Manage your farm assessment plan, M-Pesa mobile money records, and factual invoice history."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToPlans}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs md:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>View Available Plans</span>
            </button>
            <Link
              href="/pricing"
              className="px-3.5 py-2.5 rounded-xl border border-surface-container-high hover:bg-surface-container text-xs md:text-sm font-semibold text-on-surface transition-all flex items-center gap-1.5"
            >
              <span>Compare Plans</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-fadeIn ${
              feedback.type === "success"
                ? "bg-primary/10 border border-primary/20 text-primary font-medium"
                : "bg-red-50 border border-red-200 text-red-700 font-medium"
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{feedback.msg}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-on-surface-variant font-medium">
              Loading verified billing details...
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Top Row: Current Plan Status + M-Pesa Mobile Money Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left 2 Cols: Factual Current Plan Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 md:p-7 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm space-y-6">
                  {/* Plan Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                          sub
                            ? "bg-primary/15 text-primary"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {sub ? "verified" : "hourglass_empty"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                          Current Subscription Status
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                          {sub ? sub.planName : "No Active Assessment Plan"}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shrink-0 ${
                        sub?.status === "ACTIVE"
                          ? "bg-primary/15 text-primary border border-primary/25"
                          : sub?.status === "CANCELLED"
                          ? "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {sub ? sub.status : "Inactive / Free Tier"}
                    </span>
                  </div>

                  {/* Factual Plan Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-container-high/40 text-xs">
                    <div>
                      <span className="text-on-surface-variant block mb-0.5">Price</span>
                      <span className="text-lg font-bold text-on-surface">
                        {sub ? sub.formattedAmount : "KES 0"}
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">
                        {sub ? `per ${sub.interval || "month"}` : "Free access"}
                      </span>
                    </div>

                    <div>
                      <span className="text-on-surface-variant block mb-0.5">Payment Method</span>
                      <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        M-Pesa Mobile Money
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">
                        Paystack Secure
                      </span>
                    </div>

                    <div>
                      <span className="text-on-surface-variant block mb-0.5">Renewal / Expiration</span>
                      <span className="text-sm font-semibold text-on-surface block mt-0.5">
                        {sub?.nextPaymentDate
                          ? new Date(sub.nextPaymentDate).toLocaleDateString()
                          : sub?.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                          : sub
                          ? "Active / Ongoing"
                          : "No Renewal"}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {sub?.status === "ACTIVE" ? "Auto-renews monthly" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* If user has no active plan: clear invitation banner */}
                  {!sub && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                          <span className="material-symbols-outlined text-[18px] text-amber-600">
                            info
                          </span>
                          Unlock Your Comprehensive 8-Pillar Assessment
                        </p>
                        <p className="text-amber-800/90 leading-relaxed">
                          Choose an assessment plan below to evaluate your farm capabilities,
                          unlock instant recommendations, and receive verified maturity scores.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToPlans}
                        className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shrink-0 shadow-xs cursor-pointer"
                      >
                        Choose Plan Below &darr;
                      </button>
                    </div>
                  )}

                  {/* Included features if sub is active */}
                  {sub?.planFeatures && sub.planFeatures.length > 0 && (
                    <div className="pt-3 border-t border-surface-container-high/40">
                      <span className="text-xs font-bold text-on-surface block mb-2.5">
                        Features included in your current active tier:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {sub.planFeatures.map((feat: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Plan Actions */}
                  <div className="pt-4 border-t border-surface-container-high/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={scrollToPlans}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">upgrade</span>
                        <span>{sub ? "Change / Upgrade Plan" : "Select Assessment Plan"}</span>
                      </button>

                      {sub?.status === "ACTIVE" && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={handleCancelSubscription}
                          className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Cancel Auto-Renewal
                        </button>
                      )}
                    </div>

                    <Link
                      href="/pricing"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Full feature comparison table</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                {/* Primary Payment Method Focus: M-Pesa Mobile Money */}
                <div className="p-6 md:p-7 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container-high/40">
                    <div className="flex items-center gap-3">
                      {/* Safaricom M-Pesa Green Badge */}
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
                        <span className="material-symbols-outlined text-[22px]">phone_android</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-on-surface">
                            Primary Payment Method: M-Pesa Mobile Money
                          </h3>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Instant STK push payment directly to your Safaricom mobile handset.
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 self-start sm:self-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      M-Pesa Push Ready
                    </span>
                  </div>

                  {/* Registered Phone Status / Edit */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-on-surface-variant font-medium block">
                          Registered M-Pesa Phone Number
                        </span>
                        {registeredPhone ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-base font-bold text-on-surface font-mono">
                              {registeredPhone}
                            </span>
                            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                              check_circle
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Verified
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-700 font-medium mt-1">
                            No M-Pesa phone number on record. Add your number for 1-tap checkout.
                          </p>
                        )}
                      </div>

                      {!isEditingPhone && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhoneInput(registeredPhone || "");
                            setIsEditingPhone(true);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-surface-container-high hover:bg-surface-container text-xs font-semibold text-primary transition-all cursor-pointer"
                        >
                          {registeredPhone ? "Change Number" : "Register Phone"}
                        </button>
                      )}
                    </div>

                    {isEditingPhone && (
                      <form
                        onSubmit={handleSavePhone}
                        className="pt-3 border-t border-surface-container-high/40 space-y-3"
                      >
                        <label className="text-xs font-semibold text-on-surface block">
                          Enter Safaricom M-Pesa Mobile Number
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="tel"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="e.g. +254 712 345 678 or 0712 345 678"
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-primary font-mono"
                          />
                          <button
                            type="submit"
                            disabled={phoneSaving}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                          >
                            {phoneSaving ? "Saving..." : "Save Number"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingPhone(false)}
                            className="px-3 py-2 rounded-xl border border-surface-container-high text-xs text-on-surface-variant hover:bg-surface-container cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-[11px] text-on-surface-variant">
                          This phone number will receive instant M-Pesa STK prompts when you subscribe or upgrade.
                        </p>
                      </form>
                    )}
                  </div>

                  {/* How M-Pesa Mobile Money Works */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-surface-container-low/60 border border-surface-container-high/30">
                      <span className="font-bold text-on-surface block mb-1">1. Select Plan</span>
                      <p className="text-[11px] text-on-surface-variant">
                        Choose your 1, 4, or 8 pillar assessment plan below.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-container-low/60 border border-surface-container-high/30">
                      <span className="font-bold text-on-surface block mb-1">2. STK Prompt</span>
                      <p className="text-[11px] text-on-surface-variant">
                        An M-Pesa prompt automatically pops up on your Safaricom mobile phone.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-container-low/60 border border-surface-container-high/30">
                      <span className="font-bold text-on-surface block mb-1">3. Enter PIN</span>
                      <p className="text-[11px] text-on-surface-variant">
                        Enter your private M-Pesa PIN. Your assessment unlocks instantly!
                      </p>
                    </div>
                  </div>

                  {/* Secondary Payment Method: Factual Card on File Status */}
                  <div className="pt-3 border-t border-surface-container-high/40">
                    <span className="text-xs font-bold text-on-surface block mb-2">
                      Alternative / Backup Payment Method: Card
                    </span>
                    {sub?.cardLast4 ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md bg-white shadow-xs border border-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-700 uppercase">
                            {sub?.cardBrand || "CARD"}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-on-surface block">
                              {sub?.cardBrand?.toUpperCase() || "CARD"} •••• {sub?.cardLast4}
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              {sub?.cardExpMonth && sub?.cardExpYear
                                ? `Expires ${sub.cardExpMonth}/${sub.cardExpYear}`
                                : "Card authorized on Paystack"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          On File
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-surface-container-low/40 border border-surface-container-high/30 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">credit_card</span>
                          <span>
                            No card stored on file. Credit &amp; Debit cards can also be used securely during checkout.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Col: Invoice & Order History (Factual Only) */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        receipt_long
                      </span>
                      <span>Invoice &amp; Receipts</span>
                    </h3>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {orders.length} factual record{orders.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-surface-container-low/50 text-center space-y-2">
                      <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">
                        description
                      </span>
                      <p className="text-xs text-on-surface-variant font-medium">
                        No transaction history on record yet.
                      </p>
                      <p className="text-[11px] text-on-surface-variant/70">
                        Invoices and M-Pesa receipts will appear here automatically upon completing payments.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {orders.map((ord: any) => (
                        <div
                          key={ord.id}
                          className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-on-surface block">
                              {ord.planType.replace(/_/g, " ")}
                            </span>
                            <span className="text-[11px] text-on-surface-variant block">
                              {new Date(ord.date).toLocaleDateString()}
                            </span>
                            {ord.mpesaReceiptNumber && (
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                M-Pesa: {ord.mpesaReceiptNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary block">
                              {ord.formattedAmount}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {orders.length > 0 && (
                    <div className="pt-2 border-t border-surface-container-high/40">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full py-2.5 rounded-xl border border-surface-container-high hover:bg-surface-container text-xs font-semibold text-on-surface transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        <span>Print Invoice Summary</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Agribusiness Support Card */}
                <div className="p-5 rounded-2xl bg-primary-container/15 border border-primary-container/30 text-xs space-y-2.5">
                  <span className="font-bold text-primary flex items-center gap-1.5 text-sm">
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    Need Billing or M-Pesa Help?
                  </span>
                  <p className="text-on-surface-variant leading-relaxed">
                    Have questions about M-Pesa STK prompts, VAT tax invoices, or farm enterprise volume plans? Our agribusiness support specialists are ready to assist.
                  </p>
                  <Link
                    href="/contact"
                    className="text-primary font-bold hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>Contact Agribusiness Support</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* HIGHLY HIGHLIGHTED & PROMINENT AVAILABLE PLANS SECTION */}
            <div
              id="available-plans"
              className="pt-6 border-t-2 border-primary/20 space-y-6 scroll-mt-6"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
                      Assessment Tiers
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      M-Pesa Supported
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mt-2">
                    Available Assessment Plans
                  </h2>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                    Select a diagnostic tier to evaluate your farm across the Future Farms Framework. Pay instantly with M-Pesa mobile money.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-lowest p-2 rounded-xl border border-surface-container-high">
                  <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
                  <span>Direct checkout via Paystack with M-Pesa &amp; Card</span>
                </div>
              </div>

              {/* 3-Tier Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Plan 1: 1 Pillar Assessment */}
                <div
                  className={`bg-surface-container-lowest rounded-3xl p-6 border flex flex-col justify-between transition-all hover:shadow-md ${
                    sub?.planId === "1_PILLAR"
                      ? "border-2 border-primary ring-2 ring-primary/20"
                      : "border-surface-container-high hover:border-primary/50"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-high/60 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">article</span>
                      </div>
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded-full">
                        Single Pillar
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-on-surface">1 Pillar Assessment</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Assess any single focus pillar of your choice
                      </p>
                    </div>

                    <div className="py-2 border-y border-surface-container-high/40">
                      <span className="text-3xl font-black text-on-surface">KES 100</span>
                      <span className="text-xs text-on-surface-variant ml-1.5 font-medium">
                        / month
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>Any 1 pillar of your choice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>25 diagnostic questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>Instant gap recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>Capability status feedback</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-surface-container-high/40 space-y-2">
                    {sub?.planId === "1_PILLAR" ? (
                      <div className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-bold text-xs text-center">
                        ✓ Current Active Plan
                      </div>
                    ) : (
                      <Link
                        href="/checkout?plan=1_PILLAR&amount=100"
                        className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-dim text-on-surface font-bold text-xs text-center block transition-all shadow-xs"
                      >
                        Select 1 Pillar — KES 100
                      </Link>
                    )}
                    <span className="text-[11px] text-center text-on-surface-variant block">
                      Pay via M-Pesa or Card
                    </span>
                  </div>
                </div>

                {/* Plan 2: 4 Pillars Assessment */}
                <div
                  className={`bg-surface-container-lowest rounded-3xl p-6 border flex flex-col justify-between transition-all hover:shadow-md ${
                    sub?.planId === "4_PILLARS"
                      ? "border-2 border-primary ring-2 ring-primary/20"
                      : "border-surface-container-high hover:border-primary/50"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-high/60 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">assignment</span>
                      </div>
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded-full">
                        Key Areas
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-on-surface">4 Pillars Assessment</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Assess any 4 key pillars &amp; track progress
                      </p>
                    </div>

                    <div className="py-2 border-y border-surface-container-high/40">
                      <span className="text-3xl font-black text-on-surface">KES 500</span>
                      <span className="text-xs text-on-surface-variant ml-1.5 font-medium">
                        / month
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>Any 4 key pillars of your choice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>100 diagnostic questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>Pillar scores across all 4 chosen pillars</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <strong className="text-on-surface">
                          Farm Transformation Plan (PDF Summary)
                        </strong>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-surface-container-high/40 space-y-2">
                    {sub?.planId === "4_PILLARS" ? (
                      <div className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-bold text-xs text-center">
                        ✓ Current Active Plan
                      </div>
                    ) : (
                      <Link
                        href="/checkout?plan=4_PILLARS&amount=500"
                        className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-dim text-on-surface font-bold text-xs text-center block transition-all shadow-xs"
                      >
                        Select 4 Pillars — KES 500
                      </Link>
                    )}
                    <span className="text-[11px] text-center text-on-surface-variant block">
                      Pay via M-Pesa or Card
                    </span>
                  </div>
                </div>

                {/* Plan 3: Full Assessment (8 Pillars) - FEATURED / BEST VALUE */}
                <div className="bg-gradient-to-b from-primary/5 via-surface-container-lowest to-surface-container-lowest rounded-3xl p-6 md:p-7 border-2 border-primary relative flex flex-col justify-between shadow-lg ring-4 ring-primary/10 transition-all hover:shadow-xl">
                  {/* Glowing Best Value Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    <span>BEST VALUE &bull; RECOMMENDED</span>
                  </div>

                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
                        <span className="material-symbols-outlined text-2xl">fact_check</span>
                      </div>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Complete Framework
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-primary">Full Assessment</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        All 8 Pillars Complete Diagnostic &amp; Verified Certification
                      </p>
                    </div>

                    <div className="py-2 border-y border-primary/20">
                      <span className="text-3xl lg:text-4xl font-black text-primary">KES 1,000</span>
                      <span className="text-xs text-on-surface-variant ml-1.5 font-medium">
                        / month
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <strong className="text-on-surface">All 8 pillars covered</strong>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>200 diagnostic questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>Full radar profile &amp; 40 capability breakdown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <strong className="text-on-surface">
                          Farm Transformation Action Plan (PDF Full Plan)
                        </strong>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <strong className="text-primary font-bold">
                          Commercial Farm Classification Certificate Included
                        </strong>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-primary/20 space-y-2">
                    {sub?.planId === "FULL_ASSESSMENT" ? (
                      <div className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-xs text-center shadow-xs">
                        ✓ Current Active Plan
                      </div>
                    ) : (
                      <Link
                        href="/checkout?plan=FULL_ASSESSMENT&amount=1000"
                        className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs text-center block transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        <span>Unlock Full 8 Pillars — KES 1,000</span>
                      </Link>
                    )}
                    <span className="text-[11px] text-center text-emerald-800 font-semibold block flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Instant M-Pesa STK Push on Checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
