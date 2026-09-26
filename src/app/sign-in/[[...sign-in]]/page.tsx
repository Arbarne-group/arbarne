"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { clearLocalAppData } from "@/lib/onboardingGuard";

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
    image: "/photo10.png",
  },
  
];

export default function SignInPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fresh login starts with clean storage
  useEffect(() => {
    clearLocalAppData();
  }, []);

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
     <main className="min-h-screen w-full bg-primary lg:h-screen lg:overflow-hidden">
          <div className="grid h-full w-full lg:grid-cols-[1.15fr_0.85fr]">
            
            {/* =========================================================
                LEFT — BRAND STORY & CAROUSEL (Desktop Only)
            ========================================================= */}
            <section className="relative hidden h-full overflow-hidden lg:flex lg:flex-col lg:justify-between p-8 xl:p-12">
              
              {/* Background Images */}
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
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0E3B2B]/65 via-[#0E3B2B]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#071F17]/80 to-transparent" />
    
              {/* Decorative Geometry */}
              <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full border border-white/10" />
    
              
              
              {/* Active Slide Content */}
              <div className="relative z-10 max-w-xl py-6 mt-52">
                <p
                  key={`eyebrow-${currentSlide}`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 animate-[slideUp_600ms_ease-out]"
                >
                  {slide.eyebrow}
                </p>
    
                <h1
                  key={`title-${currentSlide}`}
                  className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white animate-[slideUp_650ms_ease-out] xl:text-5xl 2xl:text-6xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {slide.title}
                </h1>
    
                <p
                  key={`description-${currentSlide}`}
                  className="mt-4 text-lg leading-relaxed text-white/80 animate-[slideUp_700ms_ease-out] xl:text-base"
                >
                  {slide.description}
                </p>
    
                <div
                  key={`label-${currentSlide}`}
                  className="mt-6 flex items-center gap-3 animate-[slideUp_750ms_ease-out]"
                >
                  
                  
                </div>
              </div>
    
              {/* Slide Controls */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        currentSlide === index
                          ? "w-8 bg-white"
                          : "w-1.5 bg-white/35 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
    
                <div className="flex gap-2">
                  <button
                    onClick={previousSlide}
                    aria-label="Previous slide"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/80 backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
    
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/80 backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
    
            {/* =========================================================
                RIGHT — SIGN UP FORM CONTAINER (Grid Removed)
            ========================================================= */}
    
            <section className="relative flex h-full w-full flex-col justify-between overflow-y-auto bg-white p-6 sm:p-10 lg:p-8 xl:p-12">
              
              {/* Decorative Ambient Radial Glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
                <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />
              </div>
    
              {/* Form Content Wrapper */}
              <div className="relative z-10 my-auto flex w-full flex-col items-center justify-center">
                
                {/* Logo on Right Side Before Form */}
                <div className="mb-2 flex w-full h-32 md:h-36  justify-center md:justify-start items-center  ">
                  <Image
                    src="/ffi-green-horizontal.png"
                    alt="Future Farms"
                    width={220}
                    height={110}
                    priority
                    className="md:h-38 md:w-68 w-72 h-40 object-cover"
                  />
                </div>
    
                {/* Platform Description & Value Proposition */}
                <div className="md:mb-6 mb-10   w-full max-w-md text-center md:text-left">
                  <p className="text-[17px] font-semibold uppercase tracking-[0.22em] text-secondary">
                    Future Farms Framework
                  </p>
                  
                  <p className="mt-2 text-md leading-relaxed text-gray-800 md:text-lg">
                    Assess your farm using the Farm Systems Capability and Maturity Framework, designed to guide and measure your farm’s transition toward future-readiness.
                  </p>
                </div>
    
                {/* Clerk Component Styling */}
                <div className="w-full max-w-md">
                  <SignIn
                    fallbackRedirectUrl="/onboarding"
                    forceRedirectUrl="/onboarding"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "!bg-gray-100 !shadow-2xl !rounded-2xl !p-6 sm:!p-8 !w-full !border-0",
                        headerTitle: "!text-gray-900 !font-semibold !text-xl",
                        headerSubtitle: "!text-gray-500 !text-sm",
                        socialButtonsBlockButton:
                          "!border-gray-200 !bg-white hover:!bg-gray-50 !rounded-xl !h-11",
                        socialButtonsBlockButtonText:
                          "!text-gray-700 !font-medium",
                        formFieldLabel: "!text-gray-700 !font-medium !text-xs !uppercase !tracking-wider",
                        formFieldInput:
                          "!border-gray-200 !rounded-xl !h-11 focus:!border-[#0E3B2B] focus:!ring-[#0E3B2B]/20 !text-gray-900",
                        formButtonPrimary:
                          "!bg-primary hover:!bg-[#09261c] !rounded-xl !h-11 !text-sm !font-semibold !shadow-md",
                        footerActionLink:
                          "!text-[#0E3B2B] hover:!text-[#071F17] !font-semibold",
                        dividerLine: "!bg-gray-200",
                        dividerText: "!text-gray-400 !text-xs",
                      },
                    }}
                  />
                </div>
              </div>
    
              
            </section>
          </div>
    
          <style jsx global>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(12px);
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
