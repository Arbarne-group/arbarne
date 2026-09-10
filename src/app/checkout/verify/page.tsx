"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setError("No transaction reference found in callback.");
      setLoading(false);
      return;
    }

    fetch("/api/billing/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setDetails(data);
        } else {
          setError(data.error || "Failed to verify transaction.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Network error while verifying payment with Paystack.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reference]);

  return (
    <div className="max-w-xl mx-auto w-full p-6 md:p-10 my-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container-high text-center">
      {loading ? (
        <div className="py-12 space-y-4">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-on-surface">Verifying Payment with Paystack...</h2>
          <p className="text-sm text-on-surface-variant">
            Please wait while we confirm your subscription and activate your farm assessment.
          </p>
        </div>
      ) : success ? (
        <div className="py-8 space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-xs">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-primary tracking-wider">
              Payment Confirmed
            </span>
            <h1 className="text-2xl font-bold text-on-surface mt-1">
              Subscription Successfully Activated!
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">
              Thank you for subscribing. Your assessment access and diagnostic tools are now unlocked.
            </p>
          </div>

          {details && (
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                <span className="text-on-surface-variant">Plan</span>
                <span className="font-bold text-on-surface">{details.plan?.name || "Assessment Plan"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                <span className="text-on-surface-variant">Amount Paid</span>
                <span className="font-bold text-primary">
                  KES {details.order?.amount?.toLocaleString() || "1,000"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                <span className="text-on-surface-variant">Reference</span>
                <span className="font-mono text-on-surface-variant">{reference}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Billing Cycle</span>
                <span className="font-semibold text-on-surface">Monthly Recurring (Auto-Debit)</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/assessment"
              className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-sm hover:opacity-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Take Farm Assessment</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/billing"
              className="px-5 py-3 rounded-xl border border-surface-container-high hover:bg-surface-container text-sm font-semibold text-on-surface transition-all inline-flex items-center justify-center gap-2"
            >
              <span>View Billing &amp; Invoices</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-8 space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl">error</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Payment Verification Issue</h2>
            <p className="text-sm text-red-600 mt-2">{error}</p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => router.push("/pricing")}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold"
            >
              Back to Pricing
            </button>
            <Link
              href="/help"
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="p-12 text-center text-sm text-on-surface-variant">
            Loading verification...
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </AppShell>
  );
}
