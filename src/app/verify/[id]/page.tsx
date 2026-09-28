"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { VERIFY_RESEND_SECONDS } from "@/lib/verification-client";

function VerifyForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const mailFailed = searchParams.get("mail") === "failed";
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loadError, setLoadError] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);
  const submitting = useRef(false);

  useEffect(() => {
    if (!id) {
      setLoadError("Invalid verification link.");
      return;
    }
    fetch(`/api/auth/verify?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setLoadError(data.error || "Invalid verification link.");
          return;
        }
        setMaskedEmail(data.challenge?.emailMasked || "");
        if (typeof data.challenge?.resendIn === "number" && data.challenge.resendIn > 0) {
          setCooldown(data.challenge.resendIn);
        }
        if (data.challenge?.expired) {
          setError("That code expired. Request a new one below.");
        }
      })
      .catch(() => setLoadError("Could not load verification. Please try again."));
  }, [id]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Focus the first box on load.
  useEffect(() => {
    boxRefs.current[0]?.focus();
  }, []);

  function setDigit(index: number, value: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setError("");
  }

  function handleChange(index: number, raw: string) {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (!d) return;
    setDigit(index, d);
    boxRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      setDigit(index - 1, "");
      boxRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const nums = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (nums.length === 0) return;
    setDigits((prev) => prev.map((_, i) => nums[i] || ""));
    setError("");
    boxRefs.current[Math.min(nums.length, 5)]?.focus();
  }

  async function submitCode(code: string) {
    if (submitting.current || code.length !== 6) return;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Verification failed.");
        setDigits(["", "", "", "", "", ""]);
        boxRefs.current[0]?.focus();
        submitting.current = false;
        return;
      }
      router.push("/complete-profile");
    } catch {
      setError("Verification failed. Please try again.");
      submitting.current = false;
    } finally {
      setLoading(false);
    }
  }

  // Auto-submit the moment all six boxes are filled (no button).
  useEffect(() => {
    if (digits.every((d) => d !== "")) {
      submitCode(digits.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  async function handleResend() {
    if (cooldown > 0 || sending) return;
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/auth/verify/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.retryAfter) setCooldown(data.retryAfter);
        setError(data.error || "Could not resend code.");
        return;
      }
      setCooldown(VERIFY_RESEND_SECONDS);
    } catch {
      setError("Could not resend code.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9F5] px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-primary px-6 py-6 text-center">
          <Image
            src="/images/auth-logo-bdl.png"
            alt="Future Farms"
            width={160}
            height={80}
            className="mx-auto h-auto w-32 object-contain"
          />
          <h1 className="mt-3 text-2xl font-semibold text-white">Check your email</h1>
          <p className="mt-1 text-sm text-white/70">
            {maskedEmail ? `Enter the 6-digit code sent to ${maskedEmail}.` : "Enter your verification code."}
          </p>
        </div>

        {loadError ? (
          <p className="px-6 py-6 text-center text-sm text-red-700">{loadError}</p>
        ) : (
          <div className="space-y-4 px-6 py-6">
            {mailFailed && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                The email could not be delivered. Enter a code you already have, or tap Resend below.
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxRefs.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label={`Digit ${i + 1}`}
                  disabled={loading}
                  className="h-13 w-11 sm:h-14 sm:w-12 rounded-xl border border-gray-200 text-center text-xl sm:text-2xl font-bold text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
                />
              ))}
            </div>
            {loading && (
              <p className="text-center text-sm text-gray-500">Verifying…</p>
            )}
            <p className="text-center text-sm text-gray-500">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || sending}
                className="font-semibold text-primary cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
              >
                {sending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
