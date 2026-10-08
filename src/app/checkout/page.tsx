"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppUser as useUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";

const PRODUCT_META: Record<string, { name: string; needsPillar: boolean }> = {
  PILLAR_REASSESS: { name: "Individual Pillar Assessment", needsPillar: true },
  PILLAR_REPORT: { name: "Individual Pillar Report", needsPillar: true },
  FFV_VERIFY: { name: "Pillar Verification (FFV)", needsPillar: true },
  ANNUAL_ASSESSMENT: { name: "Annual FFMI/24 Assessment", needsPillar: false },
  FIRST_ASSESSMENT: { name: "First FFMI/24 Assessment", needsPillar: false },
};

interface Quote {
  base: number;
  referralPrice: number;
  referralDiscount: number;
  referralsConsumed: number;
  referralCredit: number;
  couponCode: string | null;
  couponDiscount: number;
  final: number;
  free: boolean;
  rewardApplied: boolean;
}

function CheckoutContent() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";
  const initialPillar = searchParams.get("pillar") || "";

  const [product, setProduct] = useState(initialProduct);
  const [pillar, setPillar] = useState(initialPillar);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoting, setQuoting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("future_farms_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.phone) {
          const stripped = u.phone.replace(/^\+254/, "").replace(/^254/, "").replace(/^0/, "").trim();
          setPhoneNumber(stripped);
        }
      }
    } catch {}
  }, []);

  const email = clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
  const meta = PRODUCT_META[product];
  const needsPillar = Boolean(meta?.needsPillar);

  const fetchQuote = useCallback(async () => {
    if (!email || !product) {
      setQuote(null);
      return;
    }
    if (needsPillar && !pillar) {
      setQuote(null);
      return;
    }
    setQuoting(true);
    setQuoteError("");
    try {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product,
          pillarId: needsPillar ? Number(pillar) : null,
          couponCode: appliedCoupon,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not price this product.");
      setQuote(data.quote);
    } catch (e: any) {
      setQuoteError(e?.message || "Could not price this product.");
      setQuote(null);
    } finally {
      setQuoting(false);
    }
  }, [email, product, pillar, appliedCoupon, needsPillar]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const applyCoupon = () => {
    setAppliedCoupon(coupon.trim() ? coupon.trim() : null);
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);
    const userEmail = email;
    let cleanPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = `+254${cleanPhone.slice(1)}`;
    } else if (cleanPhone && !cleanPhone.startsWith("+") && !cleanPhone.startsWith("254")) {
      cleanPhone = `+254${cleanPhone}`;
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          product,
          pillarId: needsPillar ? Number(pillar) : null,
          couponCode: appliedCoupon,
          paymentMethod,
          phoneNumber: cleanPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed.");
      if (data.free) {
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push(data.product === "FFV_VERIFY" ? "/ffv" : "/assessment");
        }, 1800);
        return;
      }
      if (data.authorizationUrl) {
        if (data.authorizationUrl.startsWith("/")) {
          router.push(data.authorizationUrl);
        } else {
          if (typeof window !== "undefined" && (window as any).PaystackPop && data.accessCode) {
            try {
              const popup = new (window as any).PaystackPop();
              popup.resumeTransaction(data.accessCode);
              setProcessing(false);
              return;
            } catch (e) {
              console.warn("Paystack popup failed, redirecting:", e);
            }
          }
          window.location.href = data.authorizationUrl;
        }
        return;
      }
      setPaymentSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during payment.");
      setProcessing(false);
    }
  };

  const input =
    "w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface outline-none focus:border-primary";

  return (
    <AppShell>
      <div className="max-w-[860px] mx-auto w-full px-4 md:px-10 py-8 space-y-6 pb-24">
        <div className="space-y-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Checkout
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Complete your purchase</h1>
          <p className="text-sm text-on-surface-variant">
            Prices are computed on our servers — referral rewards and coupons apply automatically.
          </p>
        </div>

        <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 md:p-8 space-y-5 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">Product</label>
            <select value={product} onChange={(e) => { setProduct(e.target.value); setPillar(""); }} className={input}>
              <option value="">Select a product…</option>
              {Object.entries(PRODUCT_META).map(([id, m]) => (
                <option key={id} value={id}>{m.name}</option>
              ))}
            </select>
          </div>

          {needsPillar && (
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Pillar</label>
              <select value={pillar} onChange={(e) => setPillar(e.target.value)} className={input}>
                <option value="">Select pillar 1–8…</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>Pillar {n}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">Coupon code (optional)</label>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="e.g. HARVEST20"
                className={input}
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="shrink-0 px-4 py-2 rounded-xl border border-outline-variant text-sm font-bold text-on-surface hover:border-primary cursor-pointer"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs mt-1.5 text-on-surface-variant">
                Applied: <span className="font-bold text-primary">{appliedCoupon}</span>{" "}
                <button type="button" onClick={() => { setAppliedCoupon(null); setCoupon(""); }} className="underline cursor-pointer">
                  remove
                </button>
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-surface-container-low p-4 text-sm space-y-1.5">
            {!isLoaded || quoting ? (
              <p className="text-on-surface-variant">Calculating price…</p>
            ) : quoteError ? (
              <p className="text-red-600">{quoteError}</p>
            ) : quote ? (
              <>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Base price</span>
                  <span>KES {quote.base.toLocaleString()}</span>
                </div>
                {quote.rewardApplied && (
                  <div className="flex justify-between text-[#009924] font-semibold">
                    <span>
                      Referral credit
                      {quote.referralsConsumed > 0 &&
                        ` (${quote.referralsConsumed} referral${quote.referralsConsumed === 1 ? "" : "s"})`}
                    </span>
                    <span>−KES {quote.referralDiscount.toLocaleString()}</span>
                  </div>
                )}
                {quote.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#009924] font-semibold">
                    <span>Coupon {quote.couponCode}</span>
                    <span>−KES {quote.couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-on-surface pt-1.5 border-t border-outline-variant/40">
                  <span>Total due</span>
                  <span>KES {quote.final.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <p className="text-on-surface-variant">Select a product{needsPillar ? " and pillar" : ""} to see the price.</p>
            )}
          </div>

          {quote && !quote.free && (
            <div className="grid grid-cols-2 gap-2">
              {(["mpesa", "card"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-bold cursor-pointer ${
                    paymentMethod === m
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {m === "mpesa" ? "M-Pesa" : "Card"}
                </button>
              ))}
            </div>
          )}

          {quote && !quote.free && paymentMethod === "mpesa" && (
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">
                M-Pesa phone number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712 345 678"
                inputMode="tel"
                className={input}
              />
              <p className="text-xs text-on-surface-variant mt-1.5">
                You will receive an instant PIN prompt on your handset.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {paymentSuccess ? (
            <p className="text-sm font-bold text-[#009924] bg-[#009924]/10 border border-[#009924]/30 rounded-xl px-4 py-3 text-center">
              Payment complete — your purchase is unlocked.
            </p>
          ) : (
            <button
              type="button"
              onClick={handlePayment}
              disabled={processing || !quote}
              className="w-full px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-60 cursor-pointer"
            >
              {processing
                ? "Processing…"
                : quote && quote.free
                  ? "Confirm (no payment needed)"
                  : `Pay KES ${(quote?.final || 0).toLocaleString()}`}
            </button>
          )}

          <p className="text-center text-xs text-on-surface-variant">
            <Link href="/pricing" className="font-bold text-primary">Back to pricing</Link>
          </p>
        </div>
      </div>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
    </AppShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading checkout…" />}>
      <CheckoutContent />
    </Suspense>
  );
}
