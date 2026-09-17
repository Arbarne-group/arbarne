"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";

const slides = [
  {
    eyebrow: "FUTURE FARMS INITIATIVE",
    title: (
      <>
        Build your farm's capabilities.
        <br />
        <span>Become future-ready.</span>
      </>
    ),
    description:
      "Assess where your farm stands, strengthen its capabilities, and track your progress toward a more resilient, productive, and investment-ready farm.",
    label: "A practical pathway for farm transformation",
    visual: "01",
    image: "/photo8.png",
  },
  {
    eyebrow: "FUTURE FARMS FRAMEWORK",
    title: (
      <>
        Know where you stand.
        <br />
        <span>Know where to go next.</span>
      </>
    ),
    description:
      "Assess your farm's capabilities, measure maturity, and identify the priorities that will move your farm forward.",
    label: "Farm Systems Capability & Maturity Framework",
    visual: "02",
    image: "/photo3.png",
  },
];

export default function SignInPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const slide = slides[currentSlide];

  return (
    <main className="h-screen w-full overflow-x-hidden bg-[#F7F9F5]">
      {/* CHANGED: this is now the single scroll container.
          - lg:h-screen bounds its height on desktop
          - lg:overflow-y-auto handles scrolling for BOTH columns as one unit
          - On mobile, there's no fixed height, so it just grows naturally
            and the browser/page scrolls (no nested scroll needed there). */}
      <div className="grid w-full lg:h-screen lg:grid-cols-[1.15fr_0.85fr] lg:overflow-y-auto">

        {/* ---------------- LEFT SECTION (desktop only) ---------------- */}
        {/* CHANGED: no more h-screen/overflow-y-auto here — it just stretches
            to fill the grid row height (grid items stretch by default).
            overflow-hidden stays, but only to clip the absolute-positioned
            background images/decorative circles, not for scrolling. */}
        <section className="relative hidden overflow-hidden lg:block">

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

          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Green brand overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0E3B2B]/95 via-[#0E3B2B]/50 to-transparent" />

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#071F17]/80 to-transparent" />

          {/* Decorative circles */}
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full border border-white/10" />

          {/* Content — responsive sizing so it fits without its own scroll */}
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-8 xl:p-14">

            {/* Logo */}
            <div>
              <Image
                src="/images/auth-logo.png"
                alt="Future Farms"
                width={200}
                height={100}
                priority
                className="h-auto w-32 object-contain xl:w-72"
              />
            </div>

            {/* Main slide content */}
            <div className="max-w-2xl py-4">

              

              {/* Heading */}
              <h1
                key={`title-${currentSlide}`}
                className="text-3xl font-semibold leading-[1.05] tracking-tight text-white animate-[slideUp_650ms_ease-out] lg:text-4xl xl:text-6xl 2xl:text-7xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {slide.title}
              </h1>

              {/* Description */}
              <p
                key={`description-${currentSlide}`}
                className="mt-3 max-w-xl text-sm leading-6 text-white/80 animate-[slideUp_700ms_ease-out] xl:mt-5 xl:text-lg xl:leading-7"
              >
                {slide.description}
              </p>

              {/* Label */}
              <div
                key={`label-${currentSlide}`}
                className="mt-5 flex items-center gap-3 animate-[slideUp_750ms_ease-out] xl:mt-8"
              >
                <div className="h-px w-9 bg-white/80" />

                <p className="text-sm font-medium text-white/75">
                  {slide.label}
                </p>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between">

              {/* Dots */}
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

              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white/65 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white/65 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- RIGHT SECTION ---------------- */}
        {/* CHANGED: no more h-screen/overflow-y-auto here either — it just
            stretches to fill the grid row height on desktop, and grows
            naturally on mobile. The grid wrapper above owns all scrolling. */}
        <section className="relative flex w-full flex-col bg-primary">

          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            {/* Large decorative elements bounded safely */}
            <div className="absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border border-white/[0.08]" />
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/[0.035]" />
            <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full border border-white/[0.06]" />

            {/* Glow */}
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />
          </div>

          {/* Right Content Wrapper */}
          <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-between px-5 py-10 sm:px-8 lg:min-h-0 lg:px-12">

            {/* Mobile-only logo — left panel (with the real logo) is hidden below lg */}
            <div className="mb-6 flex w-full justify-center lg:hidden">
              <Image
                src="/images/auth-logo.png"
                alt="Future Farms"
                width={200}
                height={100}
                priority
                className="h-auto w-62 object-contain"
              />
            </div>

            {/* Main Form Container */}
            <div className="my-auto flex w-full max-w-md flex-col items-center  justify-center md:items-start md:justify-start">

              {/* Heading */}
              <div className="mb-6 text-center md:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">
                  Start your journey
                </p>

                <h2
                  className="mt-2 text-3xl font-semibold tracking-tight text-white"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Welcome to Future Farms
                </h2>

                <p className="mt-1 text-md text-white/60">
                  Start building a more future-ready farm.
                </p>
              </div>

              {/* Clerk Sign-up Form */}
              <div className="w-full overflow-hidden rounded-2xl">
                <SignIn
                  fallbackRedirectUrl="/onboarding"
                  forceRedirectUrl="/onboarding"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "!bg-white !shadow-2xl !rounded-2xl",
                      headerTitle: "!text-gray-900",
                      headerSubtitle: "!text-gray-500",
                      socialButtonsBlockButton:
                        "!border-gray-200 !bg-white hover:!bg-gray-50",
                      socialButtonsBlockButtonText:
                        "!text-gray-700",
                      formFieldLabel: "!text-gray-700",
                      formFieldInput:
                        "!border-gray-200 !rounded-xl focus:!border-primary focus:!ring-primary/20",
                      formButtonPrimary:
                        "!bg-primary hover:!bg-primary/90 !rounded-xl",
                      footerActionLink:
                        "!text-primary hover:!text-primary/80",
                      dividerLine: "!bg-gray-200",
                      dividerText: "!text-gray-400",
                    },
                  }}
                />
              </div>
            </div>

            {/* Bottom branding */}
            <div className="mt-8 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/20">
                Future Farms Initiative
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