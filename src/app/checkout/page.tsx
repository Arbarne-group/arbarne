"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "FULL_ASSESSMENT";
  const amount = searchParams.get("amount") || "10.00";

  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("712 345 678");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "keziah@futurefarms.africa",
          planType: plan,
          paymentMethod: paymentMethod.toUpperCase(),
          phoneNumber: paymentMethod === "mpesa" ? `+254 ${phoneNumber}` : null,
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment failed.");
      }

      setPaymentSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/pricing"
            className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors gap-1.5 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Assessment Pricing</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Payment Details Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-on-background mb-1">
                Checkout
              </h1>
              <p className="text-sm text-on-surface-variant">
                Complete your purchase to unlock your personalized farm transformation audit.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Section */}
            <section className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-8 border border-surface-variant/40">
              <h2 className="text-base font-bold text-on-background mb-5">
                Payment Method
              </h2>

              {/* Payment Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* M-Pesa Tab */}
                <label
                  onClick={() => setPaymentMethod("mpesa")}
                  className="relative cursor-pointer block"
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={() => setPaymentMethod("mpesa")}
                    className="sr-only"
                  />
                  <div
                    className={`h-full border-2 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all ${
                      paymentMethod === "mpesa"
                        ? "border-primary bg-primary-container/10 shadow-sm"
                        : "border-outline-variant hover:border-primary/40"
                    }`}
                  >
                    <img
                      alt="M-Pesa"
                      className="h-7 object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHcZ--zOAZIaqKU3S45BkNvc8Xy_P3a--CB0gwn466ssefMYTRS5Bdm0fVc52lrWrTGMMTVxTjPco0pQqJUZ7tbFrjmliK4ofdWxWySVTx9uiR6u-xIlYhGXxeL-Df8fZemuH85s2-iNgC4M50e8yGoxo5Ax5Ss53cXgzAg278AeUa5jvU3a62Ds39W3wpWg2d2pZYjWQAqyGnCwZHSt91oYYjm8txxW3I4nycpSpR2_nr2YfelYE"
                    />
                    <span className="font-semibold text-sm text-on-background">
                      M-Pesa
                    </span>
                    {paymentMethod === "mpesa" && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center bg-primary">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </label>

                {/* Card Tab */}
                <label
                  onClick={() => setPaymentMethod("card")}
                  className="relative cursor-pointer block"
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="sr-only"
                  />
                  <div
                    className={`h-full border-2 rounded-2xl p-4 flex items-center justify-center gap-2.5 transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary-container/10 shadow-sm"
                        : "border-outline-variant hover:border-primary/40"
                    }`}
                  >
                    <span className="material-symbols-outlined text-outline text-[22px]">
                      credit_card
                    </span>
                    <span className="font-semibold text-sm text-on-background">
                      Credit / Debit Card
                    </span>
                    {paymentMethod === "card" && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center bg-primary">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* M-Pesa Form */}
              {paymentMethod === "mpesa" && (
                <div className="space-y-4">
                  <p className="text-xs text-on-surface-variant">
                    Enter your Safaricom M-Pesa phone number to receive an instant PIN prompt on your handset.
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-on-background block mb-1.5">
                      M-Pesa Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-outline-variant overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-surface-bright transition-all">
                      <div className="bg-surface-container-low px-3.5 py-2.5 flex items-center gap-2 border-r border-outline-variant">
                        {/* Kenya Flag */}
                        <svg className="w-5 h-3.5 rounded-sm" viewBox="0 0 24 16">
                          <rect width="24" height="16" fill="white" />
                          <path d="M0 0H24V4H0V0Z" fill="#000000" />
                          <path d="M0 4H24V12H0V4Z" fill="#BB0000" />
                          <path d="M0 12H24V16H0V12Z" fill="#006600" />
                          <path d="M0 4H24V5H0V4Z" fill="white" />
                          <path d="M0 11H24V12H0V11Z" fill="white" />
                        </svg>
                        <span className="text-xs font-bold text-on-background">
                          +254
                        </span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="712 345 678"
                        className="flex-1 w-full border-none focus:ring-0 px-3.5 text-sm font-medium text-on-background bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-on-background block mb-1.5">
                      Card Number
                    </label>
                    <div className="flex items-center rounded-xl border border-outline-variant px-3.5 bg-surface-bright focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="flex-1 w-full py-2.5 border-none focus:ring-0 text-sm text-on-background bg-transparent focus:outline-none"
                      />
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                        credit_card
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-on-background block mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full rounded-xl border border-outline-variant px-3.5 py-2.5 text-sm bg-surface-bright focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-on-background block mb-1.5">
                        CVV / CVC
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-xl border border-outline-variant px-3.5 py-2.5 text-sm bg-surface-bright focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-on-background block mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full rounded-xl border border-outline-variant px-3.5 py-2.5 text-sm bg-surface-bright focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <section className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-8 flex flex-col h-full border border-surface-variant/40">
              <h2 className="text-base font-bold text-on-background mb-4">
                Order Summary
              </h2>

              <div className="flex items-start justify-between pb-4 mb-4 border-b border-outline-variant/50">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined fill">
                      assignment_turned_in
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-background">
                      {plan === "FULL_ASSESSMENT"
                        ? "Full Future Farm Assessment"
                        : "Individual Pillar Assessment"}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {plan === "FULL_ASSESSMENT"
                        ? "All 8 pillars, Radar maturity chart & PDF plan."
                        : "Selected pillar audit & baseline score."}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-on-background whitespace-nowrap">
                  ${amount}
                </span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-semibold text-on-background">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-primary">
                  ${amount}
                </span>
              </div>

              <div className="mt-auto space-y-4">
                {/* Security Badge */}
                <div className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 fill">
                    verified_user
                  </span>
                  <div>
                    <p className="text-xs font-bold text-on-background mb-0.5">
                      Secure • Private • Confidential
                    </p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Your farm information is strictly used to calculate maturity benchmarks and generate recommendations.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={processing || paymentSuccess}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm rounded-xl py-3.5 px-6 transition-all shadow-md btn-shadow hover-lift flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {paymentSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                      <span>Payment Verified! Opening Dashboard...</span>
                    </>
                  ) : processing ? (
                    <span>
                      {paymentMethod === "mpesa"
                        ? "Prompting Phone PIN..."
                        : "Authorizing Card..."}
                    </span>
                  ) : (
                    <>
                      <span>Complete Payment</span>
                      <span className="material-symbols-outlined text-[18px]">
                        lock
                      </span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-on-surface-variant">
                  Transactions are encrypted and processed securely.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center p-8 text-sm text-on-surface-variant">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
