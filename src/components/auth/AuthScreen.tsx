

"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import PasswordInput from "./PasswordInput";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const slides = [
  {
    eyebrow: "FUTURE FARMS FRAMEWORK",
    title: (
      <>
        Our Farms.
        <br />
        <span>Our Future.</span>
      </>
    ),
    description:
      "Assess your farm's capabilities, measure maturity, and identify the priorities that will move your farm forward.",
    visual: "02",
    image: "/photo3.png",
  },
  {
    eyebrow: "FUTURE FARMS INITIATIVE",
    title: (
      <>
        Build your farm&apos;s capabilities.
        <br />
        <span>Become future-ready.</span>
      </>
    ),
    description:
      "Assess where your farm stands, strengthen its capabilities, and track your progress toward a more resilient, productive, and investment-ready farm.",
    visual: "01",
    image: "/photo8.png",
  },
  {
    eyebrow: "FUTURE FARMS INITIATIVE",
    title: <>Future Farms Framework</>,
    description:
      "Assess your farm using the Farm Systems Capability and Maturity Framework, designed to guide and measure your farm’s transition toward future-readiness.",
    visual: "01",
    image: "/photo2.png",
  },
];

function ShowcasePanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((current) => (current + 1) % slides.length);

  const previousSlide = () =>
    setCurrentSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );

  const slide = slides[currentSlide];

  return (
    <section className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
      <div className="relative mx-auto h-screen w-full overflow-hidden">
        {/* Background images */}
        {slides.map((item, index) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              currentSlide === index
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
              sizes="60vw"
            />
          </div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 bg-linear-to-tr from-[#0E3B2B]/80 via-[#0E3B2B]/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-t from-[#071F17]/95 via-[#071F17]/60 to-transparent" />

        {/* Decorative circles */}
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />

        <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full border border-white/10" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-12">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <span
              key={`eyebrow-${currentSlide}`}
              className="inline-flex animate-[fadeIn_700ms_ease-out] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-white backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {slide.eyebrow}
            </span>
          </div>

          {/* Bottom block */}
          <div>
            <div className="max-w-full">
              <h1
                key={`title-${currentSlide}`}
                className="max-w-4xl animate-[slideUp_650ms_ease-out] text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl 2xl:text-6xl"
              >
                {slide.title}
              </h1>

              <p
                key={`description-${currentSlide}`}
                className="mt-4 max-w-4xl animate-[slideUp_700ms_ease-out] text-md leading-6 text-white/80 md:text-[20px] xl:mt-5 xl:leading-7"
              >
                {slide.description}
              </p>
            </div>

            {/* Slider controls */}
            <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-6">
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentSlide === index
                        ? "w-10 bg-white"
                        : "w-1.5 bg-white/35 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/70 backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/70 backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary";

const primaryBtn =
  "w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60";

function OrDivider() {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-gray-200" />

      <span className="text-xs font-semibold text-gray-400">OR</span>

      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

/** Only ever redirect to a path on this site — never an absolute URL. */
function safeCallback(raw: string | null): string {
  if (!raw) return "/overview";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/overview";
  return raw;
}

/** Auth.js sends the user back to /login?error=… when a provider fails.
    Without this the page looks identical to a first visit. */
const PROVIDER_ERRORS: Record<string, string> = {
  OAuthSignin: "Google sign-in could not be started. Please try again.",
  OAuthCallback: "Google sign-in did not complete. Please try again.",
  OAuthAccountNotLinked:
    "That Google account is already linked to a different sign-in method. Use email and password instead.",
  AccessDenied: "Google sign-in was refused. If you cancelled, please try again.",
  Configuration:
    "Google sign-in is not configured correctly on the server. Please contact support.",
  Verification:
    "Google sign-in could not be verified. Please try again.",
};

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.6 2.8c2.2-2 3.8-5 3.8-8.6z"
      />

      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.6-2.8c-1 .7-2.4 1.2-4.3 1.2-3.1 0-5.8-2.1-6.8-5l-3.7 2.9c2.1 4.1 6.1 6.6 10.5 6.6z"
      />

      <path
        fill="#FBBC05"
        d="M5.2 14.5c-.2-.7-.4-1.5-.4-2.5s.1-1.8.4-2.5L1.4 6.6C.5 8.4 0 10.1 0 12s.5 3.6 1.4 5.4l3.8-2.9z"
      />

      <path
        fill="#EA4335"
        d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.7 1.4 6.6l3.8 2.9c1-2.8 3.7-4.8 6.8-4.8z"
      />
    </svg>
  );
}

function GoogleButton({
  label,
  enabled,
  onError,
  callbackUrl,
  inviteCode,
}: {
  label: string;
  enabled: boolean;
  onError: (msg: string) => void;
  callbackUrl: string;
  inviteCode?: string | null;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!enabled) {
          onError(
            "Google sign-in isn't configured yet. Add GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET, or continue with email."
          );

          return;
        }
        // Carry an invite code through OAuth: the server consumes it after
        // the Google account is created so link-signups get attributed.
        try {
          if (inviteCode) {
            document.cookie = `ff_invite_ref=${encodeURIComponent(inviteCode)}; path=/; max-age=1800; SameSite=Lax`;
          }
        } catch {}
        signIn("google", { callbackUrl });
      }}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
    >
      <GoogleIcon />

      {label}
    </button>
  );
}

function LoginPane({
  onSwitch,
  onForgot,
  googleEnabled,
}: {
  onSwitch: () => void;
  onForgot: () => void;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "UNVERIFIED") {
          try {
            const r = await fetch("/api/auth/verify/resend", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
              }),
            });

            const rj = await r.json().catch(() => ({}));

            if (rj.publicId) {
              router.push(
                `/verify/${rj.publicId}${
                  rj.mailSent === false ? "?mail=failed" : ""
                }`
              );

              return;
            }
          } catch {}

          setError(
            "Your email is not verified yet. Please try signing up again to get a code."
          );

          return;
        }

        setError(data.error || "Invalid email or password.");

        return;
      }

      try {
        localStorage.setItem(
          "future_farms_user",
          JSON.stringify(data.user)
        );
      } catch {}

      const second = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (second?.error) {
        setError(
          "Login succeeded but the session failed. Please try again."
        );

        return;
      }

      // Staff land in their workspace, everyone else follows the callback.
      try {
        const me = await fetch("/api/auth/profile/details", {
          cache: "no-store",
        }).then((r) => r.json());

        const role = me?.user?.role;

        if (
          role &&
          ["FFDeveloper", "FFAdmin", "FFStaff"].includes(role)
        ) {
          router.push("/a/dashboard");
          router.refresh();

          return;
        }
      } catch {}

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full shrink-0 px-3">
      <div className="w-full overflow-hidden rounded-[20px] bg-[#FCFDFC] p-6 shadow-[0_20px_50px_-20px_rgba(4,93,97,0.25)] ring-1 ring-gray-200 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <PasswordInput
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={onForgot}
              className="cursor-pointer text-xs font-semibold text-primary hover:text-primary/80"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={primaryBtn}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="pt-4 text-center text-sm text-gray-500">
          No account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="cursor-pointer font-semibold text-primary hover:text-primary/80"
          >
            Sign up
          </button>
        </p>

        <OrDivider />

        <div className="pt-3">
          <GoogleButton
            label="Sign in with Google"
            enabled={googleEnabled}
            onError={setError}
            callbackUrl={callbackUrl}
          />
        </div>
      </div>
    </div>
  );
}

function SignupPane({
  onSwitch,
  googleEnabled,
}: {
  onSwitch: () => void;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = (searchParams.get("ref") || "").toUpperCase().trim() || null;

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          middleName,
          lastName,
          email,
          password,
          confirmPassword,
          referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || (!data.success && res.status !== 200)) {
        setError(data.error || "Failed to create account.");

        return;
      }

      if (!data.publicId) {
        setError(
          "Account created but no verification challenge found. Please try logging in."
        );

        return;
      }

      try {
        sessionStorage.setItem(
          "ff_pw_tmp",
          JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
          })
        );
      } catch {}

      router.push(`/verify/${data.publicId}`);
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full shrink-0 px-3">
      <div className="w-full overflow-hidden rounded-[20px] bg-[#FCFDFC] p-6 shadow-[0_20px_50px_-20px_rgba(4,93,97,0.25)] ring-1 ring-gray-200 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {referralCode && (
            <p className="rounded-xl bg-[#009924]/10 border border-[#009924]/25 px-3 py-2 text-sm text-[#006b1a]">
              You were invited with code <strong>{referralCode}</strong>. Your inviter
              earns referral credit when you complete an assessment.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First name *
              </label>

              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Keziah"
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last name *
              </label>

              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Wanjiku"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Middle name{" "}
              <span className="font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <input
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Optional"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email address *
            </label>

            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password *
            </label>

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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm password *
            </label>

            <PasswordInput
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat your password"
            />

            {confirmPassword.length > 0 && (
              <p
                className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${
                  password === confirmPassword
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {password === confirmPassword ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}

                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={primaryBtn}
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="pt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="cursor-pointer font-semibold text-primary hover:text-primary/80"
          >
            Log in
          </button>
        </p>

        <OrDivider />

        <div className="pt-3">
          <GoogleButton
            label="Sign up with Google"
            enabled={googleEnabled}
            onError={setError}
            callbackUrl="/complete-profile"
            inviteCode={referralCode}
          />
        </div>
      </div>
    </div>
  );
}

function ForgotPane({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      await fetch("/api/auth/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full shrink-0 px-3">
      <div className="mb-6 text-center md:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary">
          Account recovery
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-[20px] bg-[#FCFDFC] p-6 shadow-[0_20px_50px_-20px_rgba(4,93,97,0.25)] ring-1 ring-gray-200 sm:p-7">
        {done ? (
          <div className="text-center">
            <p className="text-sm text-gray-700">
              If an account exists for <strong>{email}</strong>, a reset link
              was sent. Check your inbox (valid 1 hour).
            </p>

            <button
              type="button"
              onClick={onSwitch}
              className="mt-4 cursor-pointer text-sm font-semibold text-primary hover:text-primary/80"
            >
              Back to log in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email address
              </label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={primaryBtn}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="pt-4 text-center text-sm text-gray-500">
          Remembered it?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="cursor-pointer font-semibold text-primary hover:text-primary/80"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

type AuthMode = "login" | "signup" | "forgot";

const MODE_PATH: Record<AuthMode, string> = {
  login: "/login",
  signup: "/signup",
  forgot: "/forgot-password",
};

const MODE_INDEX: Record<AuthMode, number> = {
  forgot: 0,
  login: 1,
  signup: 2,
};

export default function AuthScreen({
  initialMode = "login",
}: {
  initialMode?: AuthMode;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const searchParams = useSearchParams();
  const providerError =
    PROVIDER_ERRORS[searchParams.get("error") || ""] || "";

  // Swipe between panes AND keep the address bar in sync
  // without remounting.
  const switchMode = (next: AuthMode) => {
    setMode(next);

    try {
      window.history.replaceState(null, "", MODE_PATH[next]);
    } catch {}
  };

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          typeof data === "object" &&
          "google" in data
        ) {
          setGoogleEnabled(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F7F9F5]">
      <div className="grid w-full lg:h-screen lg:grid-cols-[1.15fr_0.85fr] lg:overflow-hidden">
        {/* ============================================================
            LEFT SIDE — FIXED 100VH SHOWCASE
        ============================================================ */}
        <ShowcasePanel />

        <section className="relative flex h-screen min-h-0 w-full flex-col overflow-y-auto bg-[#F7F9F5]">
  {/* Decorative background */}
  <div className="pointer-events-none fixed inset-y-0 right-0 overflow-hidden lg:absolute lg:inset-0">
    {/* Top sheen */}
    <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-white to-transparent" />

    {/* Soft radial light */}
    <div
      className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
      style={{
        background:
          "radial-linear(closest-side, rgba(0,153,36,0.10), transparent)",
      }}
    />

    {/* Soft radial shade */}
    <div
      className="absolute -bottom-48 left-1/4 h-[420px] w-[620px] rounded-full blur-3xl"
      style={{
        background:
          "radial-linear(closest-side, rgba(4,93,97,0.08), transparent)",
      }}
    />

    {/* Bottom-right contour rings */}
    <svg
      className="absolute -bottom-48 -right-48 h-[560px] w-[560px] text-primary opacity-[0.08]"
      viewBox="0 0 560 560"
      fill="none"
      aria-hidden="true"
    >
      {[70, 110, 150, 190, 230, 270].map((r) => (
        <circle
          key={r}
          cx="280"
          cy="280"
          r={r}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>

    {/* Top-left contour rings */}
    <svg
      className="absolute -left-40 -top-40 h-[380px] w-[380px] text-primary opacity-[0.06]"
      viewBox="0 0 380 380"
      fill="none"
      aria-hidden="true"
    >
      {[60, 100, 140, 180].map((r) => (
        <circle
          key={r}
          cx="190"
          cy="190"
          r={r}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  </div>

  {/* ================================================================
      SCROLLABLE CONTENT AREA

      IMPORTANT:
      Do NOT use justify-center here.

      The content starts from the top so that when the form becomes
      taller than the viewport, the logo and top of the form remain
      accessible and the user can scroll all the way down.
  ================================================================= */}
  <div className="relative z-10 flex w-full flex-1 flex-col items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-10">
    <div className="flex w-full max-w-md flex-col items-center">
      {/* ============================================================
          BRAND / INTRO
      ============================================================ */}
      <div className="mb-6 flex w-full flex-col items-center text-center">
        <Image
          src="/ffi-green-horizontal-landscape.png"
          alt="Future Farms"
          width={280}
          height={70}
          priority
          className="block h-auto w-52 object-contain"
        />

        <h2 className="mt-3 text-2xl font-bold text-secondary">
          Welcome to Future Farms!
        </h2>

        <p className="mt-1.5 max-w-full text-sm leading-relaxed text-gray-500 md:text-[14px] lg:text-[16px]">
          Your journey to a future-ready farm starts here. Build your farm
          profile, assess your capabilities, identify development priorities,
          verify your progress, and access opportunities to grow.
        </p>
      </div>

      {/* ============================================================
          AUTH PANES
      ================================================================= */}
              {/* Auth.js reports provider failures here via ?error= */}
              {providerError && (
                <div className="mb-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {providerError}
                </div>
              )}

              {/* Swiping panes */}
              <div className="w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${MODE_INDEX[mode] * 100}%)`,
                  }}
                >
                  <div className="w-full shrink-0">
                    <ForgotPane onSwitch={() => switchMode("login")} />
                  </div>
                  <div className="w-full shrink-0">
                    <LoginPane
                      googleEnabled={googleEnabled}
                      onSwitch={() => switchMode("signup")}
                      onForgot={() => switchMode("forgot")}
                    />
                  </div>
                  <div className="w-full shrink-0">
                    <SignupPane
                      googleEnabled={googleEnabled}
                      onSwitch={() => switchMode("login")}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-6 text-center text-xs text-gray-400 max-w-md">
                By continuing you agree to our{" "}
                <a href="/terms" className="font-semibold text-secondary hover:underline">
                  Terms of Service
                </a>{" "}
                and acknowledge the{" "}
                <a href="/privacy" className="font-semibold text-secondary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
