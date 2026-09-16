"use client";

import { SignIn } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <main className="min-h-screen bg-[#F7F9F5]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-primary text-white lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/[0.07]" />
            <div className="absolute -bottom-40 -right-20 h-128 w-lg rounded-full bg-white/5" />

            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          {/* Content */}
          <div className=" relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo */}
            <div className="flex items-center  max-w-sm ">
              <Image
                src="/images/auth-logo.png"
                alt="Future Farms"
                width={200}
                height={100}
                priority
                className="w-30 sm:w-37.5 lg:w-45 h-auto object-contain"
              />
            </div>

            {/* Slider */}
            <div className="relative max-w-2xl ">
              {/* Slide number */}
              <div
                key={`number-${currentSlide}`}
                className="mb-8 animate-[fadeIn_600ms_ease-out]"
              >
                <span className="font-mono text-sm text-white/35">
                  {slide.visual} / 02
                </span>
              </div>

              {/* Eyebrow */}
              <p
                key={`eyebrow-${currentSlide}`}
                className="mb-5 text-xs font-semibold tracking-[0.25em] text-white/55 animate-[slideUp_600ms_ease-out]"
              >
                {slide.eyebrow}
              </p>

              {/* Heading */}
              <h1
                key={`title-${currentSlide}`}
                style={{ fontFamily: "Georgia, serif" }}
                className="text-4xl  font-semibold leading-[1.08] tracking-tight xl:text-6xl animate-[slideUp_650ms_ease-out]"
              >
                {slide.title}
              </h1>

              {/* Description */}
              <p
                key={`description-${currentSlide}`}
                className="mt-7 max-w-xl text-base leading-7 text-white/80 xl:text-lg animate-[slideUp_700ms_ease-out]"
              >
                {slide.description}
              </p>

              {/* Bottom label */}
              <div
                key={`label-${currentSlide}`}
                className="mt-9 flex items-center gap-3 animate-[slideUp_750ms_ease-out]"
              >
                <div className="h-px w-8 bg-white/80" />

                <p className="text-sm font-medium text-white/80">
                  {slide.label}
                </p>
              </div>
            </div>

            {/* Slider controls */}
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
                        : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className=" relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-5 py-8 sm:px-8 sm:py-12 lg:bg-white lg:px-10 lg:py-12 ">
          <div className="pointer-events-none absolute inset-0 lg:hidden">
            {" "}
            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-white/[0.05]" />{" "}
            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-white/[0.04]" />{" "}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />{" "}
          </div>
          <div className=" relative z-10 w-full max-w-90 sm:max-w-100 lg:max-w-md ">
            <div className=" mb-4 flex justify-center sm:mb-10 lg:hidden">
              {" "}
              <Image
                src="/images/auth-logo.png"
                alt="Future Farms"
                width={220}
                height={10}
                priority
                className=" h-auto w-62.5 object-contain sm:w-52.5 "
              />{" "}
            </div>

            {/* Clerk */}
            <SignIn
              fallbackRedirectUrl="/onboarding"
              forceRedirectUrl="/onboarding"
            />

            {/* Trust / privacy message */}
            <p className="mt-8 text-center text-sm leading-5 text-gray-200 lg:text-gray-500">
              By continuing, you agree to use the Future Farms platform
              responsibly to assess and improve your farm system.
            </p>
          </div>
        </section>
      </div>

      {/* Animation styles */}
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
