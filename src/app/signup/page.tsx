"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    farmName: "",
    password: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time password strength calculation
  const calculateStrength = (pwd: string) => {
    if (!pwd) return { level: 0, text: "", colorClass: "text-on-surface-variant" };
    let score = 0;
    if (pwd.length > 5) score += 1;
    if (pwd.length > 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (pwd.length > 10 && /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score === 1) return { level: 1, text: "Weak", colorClass: "text-error" };
    if (score === 2) return { level: 2, text: "Good", colorClass: "text-amber-600" };
    return { level: 3, text: "Strong", colorClass: "text-primary" };
  };

  const strength = calculateStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      // Store current user info in localStorage for demo continuity
      localStorage.setItem("future_farms_user", JSON.stringify(data.user));
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Left Side: Brand Imagery & Message */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGvmyW_iCOmYyPwkGp3vckhLEVCzHw2dhEYGTAKtjTVWVde9bOch4L-cipVHJ03vnywNHKmY5AyG66Bp1Wrnjgk-xxP-J5DRWBvJaJX8GFSNqiw-k2V6w70KbHz2uGKRPDjvI1qw2Nh9wgn1BUY_MQ7uYmOcvxnVDrcULwJU2MyO54BJpjcxB74hrtI-XavAjDY9xBmk7xAzeMjtDUdwdx2-iztSXT0iy5akM3XFZSlOlqNMna_KY')",
          }}
        >
          {/* Overlays */}
          <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Hero text */}
          <div className="absolute bottom-0 left-0 p-12 w-full max-w-2xl text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
              Join the Future of Sustainable Farming.
            </h2>
            <p className="text-lg text-white/90 max-w-lg leading-relaxed drop-shadow-md">
              Empower your agricultural journey with data-driven insights, precision tools, and a community dedicated to growth and resilience.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:flex-none lg:px-20 xl:px-24 bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo & Header */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-primary text-4xl fill">
                agriculture
              </span>
              <span className="font-bold text-primary text-2xl tracking-tight">
                Future Farms
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Start optimizing your farm&apos;s potential today.
            </p>
          </div>

          {error && (
            <div className="mt-6 p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full rounded-xl border border-outline-variant px-3.5 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-surface-bright transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-xl border border-outline-variant px-3.5 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-surface-bright transition-colors"
                />
              </div>

              {/* Phone Number (with Kenya Country Code) */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative flex rounded-xl border border-outline-variant focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-surface-bright overflow-hidden">
                  <span className="inline-flex items-center border-r border-outline-variant bg-surface-container-low px-3 text-on-surface-variant text-sm font-medium">
                    <span className="mr-1.5">🇰🇪</span> +254
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="700 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full min-w-0 flex-1 border-0 px-3.5 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 text-sm bg-transparent"
                  />
                </div>
              </div>

              {/* Farm Name (Optional) */}
              <div>
                <label className="flex justify-between text-xs font-semibold text-on-surface mb-1.5" htmlFor="farmName">
                  <span>Farm Name</span>
                  <span className="text-on-surface-variant/70 font-normal">Optional</span>
                </label>
                <input
                  id="farmName"
                  type="text"
                  placeholder="e.g. Highland Greens Farm"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="block w-full rounded-xl border border-outline-variant px-3.5 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-surface-bright transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full rounded-xl border border-outline-variant px-3.5 py-2.5 pr-10 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-surface-bright transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="mt-2 flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-surface-variant">
                  <div
                    className={`h-full w-1/3 transition-colors duration-300 ${
                      strength.level >= 1
                        ? strength.level === 1
                          ? "bg-error"
                          : strength.level === 2
                          ? "bg-amber-500"
                          : "bg-primary"
                        : "bg-transparent"
                    }`}
                  />
                  <div
                    className={`h-full w-1/3 transition-colors duration-300 ${
                      strength.level >= 2
                        ? strength.level === 2
                          ? "bg-amber-500"
                          : "bg-primary"
                        : "bg-transparent"
                    }`}
                  />
                  <div
                    className={`h-full w-1/3 transition-colors duration-300 ${
                      strength.level >= 3 ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                </div>
                <p className={`mt-1 text-xs font-medium h-4 ${strength.colorClass}`}>
                  {strength.text}
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-xs leading-relaxed text-on-surface-variant">
                  <label htmlFor="terms" className="cursor-pointer">
                    I agree to the{" "}
                    <Link href="#" className="font-medium text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="font-medium text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm hover-lift btn-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-all items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary-container transition-colors ml-1"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
