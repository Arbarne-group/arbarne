"use client";

import { useState } from "react";
import Link from "next/link";
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
    // directly authenticate
    setTimeout(() => {
      const fakeSubmit = new Event("submit") as any;
      handleSubmit(fakeSubmit);
    }, 100);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      <div className="flex flex-1 w-full max-w-7xl mx-auto md:p-8 md:gap-8 min-h-screen items-center justify-center">
        {/* Left Column: Imagery & Brand */}
        <div className="hidden lg:flex flex-col relative w-1/2 h-[90vh] rounded-3xl overflow-hidden shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida/AEtjO1VyfklRqqOiWnHBaFz1qydPdjD6YxAD-yXctUuelHBa1Or1qNSYa_rxGl5QoirNE2t6bkX89EW1NyiFiv7MLpB_wz29dDfHtHPCtYJxyeXbGSb36HBXjkq9y2zu3zxZ6KlIkhWXoSwICDqq5U0yM6HIIl3P-dnB82ZNTwmGq00u3Vx7YJi9nSOIj0aC0CLmTSWsiE9gJhIpd2lmsgeeqWUVf0UiDVkzm5JOmNCU49StKLYMPYUYuGkY')",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full p-10 text-white">
            <h1 className="text-3xl xl:text-4xl font-bold mb-3 leading-tight max-w-lg drop-shadow-md">
              Cultivating the Future of African Agriculture.
            </h1>
            <p className="text-base text-white/85 max-w-md drop-shadow">
              Empowering farmers with data-driven insights and modern tools for sustainable growth.
            </p>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 md:p-12 bg-surface-container-lowest md:rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-surface-variant/40 max-w-lg">
          <div className="w-full">
            {/* Brand Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-4xl fill">
                  agriculture
                </span>
                <span className="font-bold text-primary text-2xl tracking-tight">
                  Future Farms
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-on-surface mb-1">
                Welcome Back
              </h2>
              <p className="text-sm text-on-surface-variant">
                Please sign in to access your farm dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-11 pr-4 py-2.5 bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm text-on-surface"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-11 py-2.5 bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-on-surface-variant cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="text-xs">
                  <Link
                    href="#"
                    className="text-primary hover:text-primary-container font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-sm hover-lift btn-shadow transition-all duration-200 cursor-pointer disabled:opacity-70"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>

              {/* Demo Quick Login Button */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full text-xs text-primary font-semibold py-2 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Quick Demo Login (Keziah - Farm Owner)
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-surface-container-lowest text-on-surface-variant text-xs font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface font-semibold text-sm transition-colors shadow-sm cursor-pointer"
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
            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary-container font-semibold hover:underline transition-all"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
