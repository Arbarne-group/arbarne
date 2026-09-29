"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PasswordInput from "@/components/auth/PasswordInput";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not reset password.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9F5] px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-primary px-6 py-6 text-center">
          <Image
            src="/images/auth-logo.png"
            alt="Future Farms"
            width={160}
            height={80}
            className="mx-auto h-auto w-32 object-contain"
          />
          <h1 className="mt-3 text-2xl font-semibold text-white">Set a new password</h1>
          <p className="mt-1 text-sm text-white/70">Choose a strong password.</p>
        </div>
        {done ? (
          <div className="px-6 py-6 text-center">
            <p className="text-sm text-gray-700">Password updated. You can now log in.</p>
            <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-primary">
              Go to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            {!token && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                This reset link is missing its token. Request a new one.
              </p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
              <PasswordInput
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={setPassword}
                placeholder="Min. 8 characters, letters + numbers"
                minLength={8}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm new password</label>
              <PasswordInput
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Repeat your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
