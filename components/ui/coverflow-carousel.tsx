"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  key?: React.Key;
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Card aspect ratio (e.g. "16/11", "4/3", "1/1"). Default "16/11". */
  aspectRatio?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  /** Position of the main text caption: "top" places it slight above the animation, "bottom" places it below. */
  captionPosition?: "top" | "bottom";
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
  onSlideClick?: (slide: CoverflowSlide, index: number) => void;
  onSlideChange?: (index: number) => void;
}

export function CoverflowCarousel({
  slides,
  rotate = 40,
  depth = 0.58,
  perspective = 3.2,
  falloff = 0.58,
  fade = 0.08,
  cardWidth = "clamp(250px, 32vw, 420px)",
  aspectRatio = "16/11",
  gap = 0.04,
  loop = true,
  showCaption = true,
  captionPosition = "top",
  showPagination = false,
  showNavigation = false,
  label = "Cover carousel",
  className,
  cardClassName,
  onSlideClick,
  onSlideChange,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    startX: number;
    startY: number;
    x: number;
    pos: number;
    v: number;
    t: number;
    isDragging: boolean;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    // Pitch calculation ensures NO wide gaps between cards; cards tuck sequentially one after another
    const pitch = width * (0.50 + gap * 0.4);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 80) * Math.sign(offset);

      // Reduce the image on both sides symmetrically at the same time:
      const scale = Math.max(0.70, 1 - Math.min(distance * 0.12, 0.30));

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg) scale(${scale})`;

      // Continuous smooth fade so images don't vanish suddenly:
      const maxVisibleDist = loop ? count / 2 : count;
      const smoothFalloff = Math.max(0, 1 - Math.pow(Math.min(1, distance / (maxVisibleDist + 0.4)), 1.8));
      const edge = loop ? Math.min(1, Math.max(0, (maxVisibleDist - distance) * 2.2)) : 1;
      card.style.opacity = String(Math.max(0, smoothFalloff * edge));
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      const newIdx = indexAt(target);
      setSelected(newIdx);
      onSlideChange?.(newIdx);

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, onSlideChange, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      isDragging: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.isDragging) {
      if (Math.hypot(deltaX, deltaY) > 6) {
        drag.isDragging = true;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // pointer capture unsupported or already captured
        }
      } else {
        return;
      }
    }

    const width = widthRef.current;
    const pitch = width * (0.50 + gap * 0.4);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const wasDragging = drag.isDragging;
    dragRef.current = null;

    if (wasDragging) {
      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      } catch {
        // ignore
      }
      // Let a flick carry, but never more than two cards.
      const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
      settle(clamp(Math.round(posRef.current + carried)));
    }
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  const aspectClass =
    aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "1/1"
        ? "aspect-square"
        : "aspect-[16/11]";

  const heightStyle =
    aspectRatio === "4/3"
      ? "calc(var(--cf-card) * 0.75)"
      : aspectRatio === "1/1"
        ? "var(--cf-card)"
        : "calc(var(--cf-card) * 0.6875)";

  return (
    <div
      className={cn("w-full flex flex-col items-center", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {/* Main text placed slightly above the animation */}
      {showCaption && active?.title && captionPosition === "top" && (
        <div
          key={`caption-top-${selected}`}
          className="mb-4 sm:mb-6 flex flex-col items-center text-center px-4 max-w-xl duration-300 animate-in fade-in"
        >
          {active.subtitle && (
            <span className="text-[11px] font-mono tracking-[-0.02em] uppercase text-zinc-500 dark:text-zinc-400 mb-1">
              {active.subtitle}
            </span>
          )}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-[-0.02em] text-foreground">
            {active.title}
          </h3>
          {active.meta && active.meta.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
              {active.meta.map((row) => (
                <span
                  key={row.label}
                  className="px-3 py-0.5 rounded-full text-[11px] font-mono bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 tracking-[-0.02em]"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">{row.label}:</span>{" "}
                  <span>{row.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3D Carousel Stage centered in middle */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps shadows clear; gradient mask prevents sudden vanishing at container edges
          className="cursor-grab overflow-hidden py-8 sm:py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing select-none"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            className="relative select-none mx-auto"
            style={{
              height: heightStyle,
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className={cn(
                  "group absolute left-1/2 top-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-xl dark:shadow-2xl will-change-transform cursor-pointer transition-shadow",
                  aspectClass,
                  cardClassName,
                )}
                style={{ width: "var(--cf-card)" }}
                onClick={() => {
                  if (dragRef.current?.isDragging) return;
                  if (index === selected) {
                    // Touching/clicking the active image moves to the next project
                    nudge(1);
                  } else {
                    goTo(index);
                  }
                  onSlideClick?.(slide, index);
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-10 pointer-events-none transition-opacity" />

                {index === selected && (
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 dark:bg-white/90 text-white dark:text-zinc-950 backdrop-blur-md text-[11px] font-mono tracking-[-0.02em] shadow-md pointer-events-none transition-all duration-300">
                    <span>Next Project</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-3 sm:left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-white/95 dark:bg-zinc-900/95 p-2 sm:p-2.5 text-zinc-900 dark:text-zinc-100 shadow-xl backdrop-blur-md transition hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-3 sm:right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-white/95 dark:bg-zinc-900/95 p-2 sm:p-2.5 text-zinc-900 dark:text-zinc-100 shadow-xl backdrop-blur-md transition hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </div>

      {/* Main text if bottom position requested */}
      {showCaption && active?.title && captionPosition === "bottom" && (
        <div
          key={`caption-bottom-${selected}`}
          className="mt-4 flex flex-col items-center px-6 duration-300 animate-in fade-in text-center max-w-xl"
        >
          <p className="text-base sm:text-lg font-medium tracking-tight text-foreground">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">
              {active.subtitle}
            </p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl className="mt-4 w-full max-w-[260px] text-[12px]">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-[4px] border-b border-border/50">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* Slide Pagination Dots */}
      {showPagination && (
        <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === selected
                  ? "w-6 bg-zinc-900 dark:bg-zinc-100"
                  : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
