"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("keziah@futurefarms.africa");
  const [password, setPassword] = useState("Password123!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      localStorage.setItem("future_farms_user", JSON.stringify(data.user));
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail("keziah@futurefarms.africa");
    setPassword("Password123!");
    setTimeout(() => {
      const fakeSubmit = new Event("submit") as any;
      handleSubmit(fakeSubmit);
    }, 100);
  };

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Left Side: Brand Imagery & Message */}
      <div className="relative hidden w-0 flex-1 lg:block lg:h-screen lg:sticky lg:top-0 overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/smart-farm-landscape.jpg')",
          }}
        >
          {/* Overlays */}
          <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Hero text */}
          <div className="absolute bottom-0 left-0 p-12 w-full max-w-2xl text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
              Build Your Farm&apos;s Capabilities. Become Future-Ready.
            </h2>
            <p className="text-base lg:text-lg text-white/90 max-w-lg leading-relaxed drop-shadow-md mb-6">
              Assess your farm, strengthen its capabilities, verify your progress, and build the credibility to access finance, markets, and investment opportunities.
            </p>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-fixed mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Future Farms Framework
              </h3>
              <p className="text-xs text-white/85 leading-relaxed">
                Assess your farm using the Farm Systems Capability and Maturity Framework, designed to guide and measure your farm&apos;s transition toward future-readiness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 flex-col justify-start min-h-screen lg:h-screen lg:overflow-y-auto px-6 py-6 sm:px-10 lg:px-16 xl:px-20 bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-sm lg:w-96 my-auto py-4 sm:py-6">
          {/* Logo & Header */}
          <div>
            <div className="flex items-center mb-3">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.webp"
                  alt="Future Farms"
                  width={220}
                  height={55}
                  className="w-full max-w-[210px] h-auto object-contain"
                  priority
                />
              </Link>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-1.5">
              <span>Sign-In</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
              Build Your Farm&apos;s Capabilities.
            </h1>
            <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
              Assess your farm, strengthen its capabilities, verify your progress, and build the credibility to access finance, markets, and investment opportunities.
            </p>
          </div>

          {error && (
            <div className="mt-3 p-2.5 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email Field */}
              <div>
                <label
                  className="block text-xs font-semibold text-on-surface mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full px-3 py-2 bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm text-on-surface placeholder:text-on-surface-variant/40"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-xs font-semibold text-on-surface mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-3 pr-10 py-2 bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm text-on-surface placeholder:text-on-surface-variant/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs text-on-surface-variant cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-xs">
                  <Link
                    href="#"
                    className="font-medium text-primary hover:text-primary-container hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm hover-lift btn-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-all items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Demo Button */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full text-xs text-primary font-semibold py-2 px-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                Quick Demo Login (Keziah - Farm Owner)
              </button>
            </form>

            {/* Divider */}
            <div className="my-3.5 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-surface-container-lowest text-on-surface-variant text-[11px] font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <div>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                    fill="#34A853"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            {/* Footer Sign Up Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-on-surface-variant">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:text-primary-container transition-colors ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
