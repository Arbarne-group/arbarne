"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import PasswordInput from "@/components/auth/PasswordInput";

function AcceptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [invite, setInvite] = useState<any>(null);
  const [loadError, setLoadError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/invite/accept?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) setLoadError(data.error || "Invalid invite.");
        else setInvite(data.invite);
      })
      .catch(() => setLoadError("Could not load invite."));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, firstName, middleName, lastName, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not accept invite.");
        return;
      }
      const second = await signIn("credentials", { email: data.email, password, redirect: false }).catch(
        () => null
      );
      if (!second || second.error) {
        // Session must exist before entering the app. Fall back to an
        // explicit login on failure.
        router.push("/login");
        return;
      }
      router.push("/overview");
      router.refresh();
    } catch {
      setError("Could not accept invite. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9F5] px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-primary px-6 py-6 text-center">
          <Image
            src="/images/auth-logo.png"
            alt="Future Farms"
            width={160}
            height={80}
            className="mx-auto h-auto w-32 object-contain"
          />
          <h1 className="mt-3 text-2xl font-semibold text-white">Accept invitation</h1>
          <p className="mt-1 text-sm text-white/70">
            {invite ? `Invited as ${invite.role}` : "Staff invitation"}
          </p>
        </div>
        {loadError ? (
          <p className="px-6 py-6 text-center text-sm text-red-700">{loadError}</p>
        ) : !invite ? (
          <p className="px-6 py-6 text-center text-sm text-gray-500">Loading invite…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">First name *</label>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={input} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Last name *</label>
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={input} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Middle name <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password *</label>
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm password *</label>
              <PasswordInput
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Accepting..." : "Accept & create account"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptForm />
    </Suspense>
  );
}
