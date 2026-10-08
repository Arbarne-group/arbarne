"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PromoCard {
  image: string;
  alt?: string;
}

interface PromoCarouselProps {
  cards: PromoCard[];
}

/*
 * Seamless infinite belt: the track holds two copies of the cards
 * (1,2,3,1,2,3…) and always moves forward. Each card hugs its image's
 * natural aspect at a fixed slim height, so as many images as fit are
 * visible with no letterbox padding. When the second copy ends, the track
 * snaps back to the start without animation — visually identical, so there
 * is never a "scroll back" rewind.
 */
export default function PromoCarousel({ cards }: PromoCarouselProps) {
  const n = cards.length;
  const loop = n > 1 ? [...cards, ...cards] : cards;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const updateSliderPosition = () => {
    const el = slideRefs.current[index];
    if (!el) return;
    setTranslateX(el.offsetLeft);
  };

  useEffect(() => {
    updateSliderPosition();
  }, [index, n]);

  useEffect(() => {
    window.addEventListener("resize", updateSliderPosition);
    // Images settling can shift offsets; re-measure shortly after mount.
    const t = setTimeout(updateSliderPosition, 500);
    return () => {
      window.removeEventListener("resize", updateSliderPosition);
      clearTimeout(t);
    };
  }, [index, n]);

  // Snap back to the start (no animation) once the duplicated copy ends.
  useEffect(() => {
    if (n > 1 && index >= loop.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, 720);
      return () => clearTimeout(t);
    }
  }, [index, loop.length, n]);

  // Automatically move to the next banner every 4 seconds.
  useEffect(() => {
    if (n <= 1 || isPaused) {
      return;
    }
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [n, isPaused]);

  if (!cards || n === 0) {
    return null;
  }

  const nextSlide = () => {
    setAnimate(true);
    setIndex((current) => (n > 1 ? current + 1 : 0));
  };

  const previousSlide = () => {
    if (n <= 1) return;
    if (index === 0) {
      // Jump (no animation) to the copy, then step back seamlessly.
      setAnimate(false);
      setIndex(n);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(n - 1);
        })
      );
      return;
    }
    setAnimate(true);
    setIndex((current) => current - 1);
  };

  const goToDot = (i: number) => {
    if (n <= 1) return;
    const base = Math.floor(Math.min(index, loop.length - 1) / n) * n;
    setAnimate(true);
    setIndex(base + i);
  };

  const activeDot = n > 1 ? index % n : 0;

  return (
    <section className="w-full overflow-hidden px-4 pb-5 sm:px-6 lg:px-10 mb-6 md:mb-8 lg:mb-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          className="group relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider viewport */}
          <div className="w-full overflow-hidden">
            {/* Slider track */}
            <div
              ref={sliderRef}
              className={`flex gap-4 ${
                animate
                  ? "transition-transform duration-700 ease-in-out"
                  : "transition-none"
              }`}
              style={{
                transform: `translate3d(-${translateX}px, 0, 0)`,
              }}
            >
              {loop.map((card, position) => (
                <Link
                  key={`${card.image}-${position}`}
                  ref={(el) => {
                    slideRefs.current[position] = el;
                  }}
                  href="/assessment"
                  aria-label="Open assessment"
                  aria-hidden={n > 1 && position >= n}
                  tabIndex={n > 1 && position >= n ? -1 : undefined}
                  className="relative block h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-container-low shadow-sm sm:h-36 lg:h-44"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.alt || "Future Farms"}
                    onLoad={updateSliderPosition}
                    className="h-full w-auto object-contain opacity-90"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Previous button */}
          {n > 1 && (
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
          {n > 1 && (
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
          {n > 1 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {cards.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to banner ${i + 1}`}
                  onClick={() => goToDot(i)}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${
                      activeDot === i
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
