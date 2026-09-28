"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PromoCard {
  image: string;
  alt?: string;
}

interface PromoCarouselProps {
  cards: PromoCard[];
}

export default function PromoCarousel({ cards }: PromoCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLAnchorElement>(null);

  /*
   * Calculate the exact amount the slider should move.
   * This prevents the last slide from moving past the end
   * and creating an empty white space.
   */
  const updateSliderPosition = () => {
    if (
      !viewportRef.current ||
      !sliderRef.current ||
      !firstCardRef.current
    ) {
      return;
    }

    const viewportWidth = viewportRef.current.clientWidth;
    const sliderWidth = sliderRef.current.scrollWidth;
    const cardWidth = firstCardRef.current.offsetWidth;

    // Tailwind gap-4 = 16px
    const gap = 16;

    const requestedPosition = activeSlide * (cardWidth + gap);

    // Never allow the slider to move beyond its content
    const maxTranslate = Math.max(0, sliderWidth - viewportWidth);

    const finalPosition = Math.min(requestedPosition, maxTranslate);

    setTranslateX(finalPosition);
  };

  /*
   * Recalculate whenever the active slide changes
   * or the browser/container is resized.
   */
  useEffect(() => {
    updateSliderPosition();
  }, [activeSlide, cards.length]);

  useEffect(() => {
    const handleResize = () => {
      updateSliderPosition();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeSlide, cards.length]);

  /*
   * Automatically move to the next banner every 5 seconds.
   */
  useEffect(() => {
    if (cards.length <= 1 || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setActiveSlide((current) =>
        current === cards.length - 1 ? 0 : current + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [cards.length, isPaused]);

  /*
   * Keep active slide valid if cards change dynamically.
   */
  useEffect(() => {
    if (activeSlide >= cards.length) {
      setActiveSlide(0);
    }
  }, [cards.length, activeSlide]);

  if (!cards || cards.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setActiveSlide((current) =>
      current === cards.length - 1 ? 0 : current + 1
    );
  };

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? cards.length - 1 : current - 1
    );
  };

  return (
    <section className="w-full overflow-hidden px-4 pb-5 sm:px-6 lg:px-10 mb-6 md:mb-8 lg:mb-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          className="group relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider viewport */}
          <div
            ref={viewportRef}
            className="w-full overflow-hidden"
          >
            {/* Slider track */}
            <div
              ref={sliderRef}
              className="flex gap-4 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translate3d(-${translateX}px, 0, 0)`,
              }}
            >
              {cards.map((card, index) => (
                <Link
                  key={card.image}
                  ref={index === 0 ? firstCardRef : undefined}
                  href="/assessment"
                  aria-label="Open assessment"
                  className="
                    relative
                    block
                    w-[80%]
                    flex-shrink-0
                    overflow-hidden
                    rounded-2xl
                    bg-gray-100
                    shadow-sm
                    sm:w-[70%]
                    md:w-[65%]
                    lg:w-[60%]
                    xl:w-[58%]
                  "
                >
                  <div className="relative aspect-[12/7] w-full">
                    <Image
                      src={card.image}
                      alt={card.alt || "Future Farms"}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="
                        (max-width: 640px) 80vw,
                        (max-width: 768px) 70vw,
                        (max-width: 1024px) 65vw,
                        60vw
                      "
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Previous button */}
          {cards.length > 1 && (
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous banner"
              className="
                absolute left-2 top-1/2 z-20
                flex h-9 w-9
                -translate-y-1/2
                items-center justify-center
                rounded-full
                bg-white/95
                text-primary
                shadow-lg
                transition-all
                hover:scale-110
                hover:bg-white
                sm:left-4
                sm:h-10
                sm:w-10
              "
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Next button */}
          {cards.length > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next banner"
              className="
                absolute right-2 top-1/2 z-20
                flex h-9 w-9
                -translate-y-1/2
                items-center justify-center
                rounded-full
                bg-white/95
                text-primary
                shadow-lg
                transition-all
                hover:scale-110
                hover:bg-white
                sm:right-4
                sm:h-10
                sm:w-10
              "
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Indicators */}
          {cards.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {cards.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to banner ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${
                      activeSlide === index
                        ? "w-8 bg-primary"
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}