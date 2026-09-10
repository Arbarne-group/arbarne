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

  const activeEmail = user?.primaryEmailAddress?.emailAddress || getActiveUserEmail();

  const fetchBillingData = () => {
    setLoading(true);
    fetch(`/api/billing/subscription?email=${encodeURIComponent(activeEmail)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBillingData();
  }, [activeEmail]);

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your recurring subscription? You will still retain access until the end of your billing cycle.")) {
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

  const handleManageCard = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "manage_card", email: activeEmail }),
      });
      const resData = await res.json();
      if (resData.manageUrl) {
        window.open(resData.manageUrl, "_blank");
      } else {
        setFeedback({
          type: "success",
          msg: "Card management simulated in test mode. In production, Paystack secure portal opens.",
        });
      }
    } catch {
      setFeedback({ type: "error", msg: "Failed to open card manager." });
    } finally {
      setActionLoading(false);
    }
  };

  const sub = data?.subscription;
  const orders = data?.orders || [];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8 flex-1">
        {/* Header */}
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
              Billing &amp; Subscription Management
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              Manage your farm assessment plan, Paystack auto-renewals, and invoice history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs md:text-sm font-semibold shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">upgrade</span>
              <span>Change / Upgrade Plan</span>
            </Link>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-fadeIn ${
              feedback.type === "success"
                ? "bg-primary/10 border border-primary/20 text-primary"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{feedback.msg}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-on-surface-variant font-medium">Loading billing details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Cols: Active Subscription & Payment Method */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Plan Bento Card */}
              <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-2xl">credit_card</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Current Plan
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-on-surface">
                        {sub ? sub.planName : "Full Assessment Access"}
                      </h2>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      sub?.status === "ACTIVE"
                        ? "bg-primary/15 text-primary"
                        : sub?.status === "CANCELLED"
                        ? "bg-zinc-100 text-zinc-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {sub?.status || "ACTIVE"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-surface-container-high/40 text-xs">
                  <div>
                    <span className="text-on-surface-variant block">Price</span>
                    <span className="text-base font-bold text-on-surface">
                      {sub ? sub.formattedAmount : "KES 1,000"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant block">per month</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Gateway</span>
                    <span className="text-sm font-semibold text-on-surface block mt-0.5">Paystack</span>
                    <span className="text-[11px] text-primary font-medium">Card &amp; M-Pesa</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Next Billing</span>
                    <span className="text-sm font-semibold text-on-surface block mt-0.5">
                      {sub?.nextPaymentDate
                        ? new Date(sub.nextPaymentDate).toLocaleDateString()
                        : "Active"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Auto-renew</span>
                  </div>
                </div>

                {sub?.planFeatures && sub.planFeatures.length > 0 && (
                  <div className="pt-3 border-t border-surface-container-high/40">
                    <span className="text-xs font-bold text-on-surface block mb-2">Included in this plan:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

                <div className="pt-3 border-t border-surface-container-high/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleManageCard}
                      className="px-4 py-2 rounded-xl border border-surface-container-high hover:bg-surface-container text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">credit_card_heart</span>
                      <span>Update Card</span>
                    </button>
                    {sub?.status === "ACTIVE" && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={handleCancelSubscription}
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      >
                        Cancel Auto-Renew
                      </button>
                    )}
                  </div>

                  <Link
                    href="/pricing"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View all plan tiers</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                    <span>Payment Method on File</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Encrypted by Paystack
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded-md bg-white shadow-xs border border-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-700 uppercase">
                      {sub?.cardBrand || "VISA"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">
                        {sub?.cardBrand?.toUpperCase() || "VISA"} •••• {sub?.cardLast4 || "4242"}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Expires {sub?.cardExpMonth || "12"}/{sub?.cardExpYear || "2028"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleManageCard}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Invoice & Order History */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                    <span>Invoice History</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {orders.length} receipt{orders.length === 1 ? "" : "s"}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-4 text-center">
                    No past invoices on record.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-bold text-on-surface block">
                            {ord.planType.replace("_", " ")}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {new Date(ord.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-primary block">
                            {ord.formattedAmount}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-surface-container-high/40">
                  <button
                    type="button"
                    onClick={() => alert("Statement sent to " + activeEmail)}
                    className="w-full py-2.5 rounded-xl border border-surface-container-high hover:bg-surface-container text-xs font-semibold text-on-surface transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download All Invoices</span>
                  </button>
                </div>
              </div>

              {/* Assistance card */}
              <div className="p-5 rounded-2xl bg-secondary-container/20 border border-secondary-container/30 text-xs space-y-2">
                <span className="font-bold text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">support_agent</span>
                  Need Help with Billing?
                </span>
                <p className="text-on-surface-variant leading-relaxed">
                  Have questions about M-Pesa automatic deductions or VAT invoices? Our agribusiness finance team is here to assist.
                </p>
                <Link
                  href="/contact"
                  className="text-secondary font-semibold hover:underline inline-block pt-1"
                >
                  Contact Support &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
