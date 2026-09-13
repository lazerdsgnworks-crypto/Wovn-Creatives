'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export interface ZoomSliderItem {
  number: string;
  src: string;
  title: string;
  desc: string;
}

const DEFAULT_SLIDER_DATA: ZoomSliderItem[] = [
  {
    number: "01",
    src: "https://i.ibb.co/m5R73btf/hf-20260912-193317-f5868bff-6646-42b1-94d8-e4edcba52484.png",
    title: "AURA",
    desc: "Soft light and iridescent atmospheric tones",
  },
  {
    number: "02",
    src: "https://i.ibb.co/QvYGTRsn/hf-20260912-194151-55ce9bd5-8fe5-40e7-b570-118cd200b1f6.png",
    title: "FLORA",
    desc: "Organic moss and botanical rock architecture",
  },
  {
    number: "03",
    src: "https://i.ibb.co/Wp6dXt2Z/hf-20260912-193317-96734949-14ed-49e4-a089-8e920589b2b0.png",
    title: "FORM",
    desc: "Shapes and chrome axes carved by light",
  },
  {
    number: "04",
    src: "https://i.ibb.co/Z1bp74TR/hf-20260912-191155-5f71e124-8e87-42bc-8b86-1cff2150b5d0.png",
    title: "FLOW",
    desc: "Smooth transitions in spatial motion",
  },
  {
    number: "05",
    src: "https://i.ibb.co/KzfwqN8C/hf-20260912-191255-78bb3dd2-f71b-435f-9c64-55cd88dc29fe.png",
    title: "DEPTH",
    desc: "Layers and visual weight in dimensional space",
  },
  {
    number: "06",
    src: "https://i.ibb.co/rRt0gSH8/hf-20260912-191457-5b20f26b-8f37-401e-862a-e1ef62e02a63.png",
    title: "ENERGY",
    desc: "Movement captured across temporal frames",
  },
  {
    number: "07",
    src: "https://i.ibb.co/WNcJNZmd/hf-20260912-192806-549bed52-0312-4da7-9f03-204a384a215e.png",
    title: "GLITCH",
    desc: "Breaking visual boundaries with digital distortion",
  },
  {
    number: "08",
    src: "https://i.ibb.co/NdjnKbwy/hf-20260912-193056-2a68be59-2b90-4b50-b553-c64e14ce4419.png",
    title: "FRAME-X",
    desc: "Cinematic still frame with prism dispersion",
  },
  {
    number: "09",
    src: "https://i.ibb.co/GfwPZrZC/hf-20260912-193857-676dccef-3441-445d-b269-8fcf6201c675.png",
    title: "LIGHTPLAY",
    desc: "High contrast and luminous specular highlights",
  },
  {
    number: "10",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    title: "MINIMAL",
    desc: "Restrained geometric structure and negative space",
  },
];

const SCROLL_PER_PX = 1.0;
const LERP_FACTOR = 0.08;

const DRAG_LERP_FACTOR = 0.22;
const MOMENTUM_FRICTION = 0.92;
const MIN_MOMENTUM = 0.1;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const SLIDER_BOTTOM_OFFSET = 24;

const REDUCED_MOTION_LERP_FACTOR = 1;
const REDUCED_MOTION_FADE_DURATION = 0.18;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

const lerp = (a: number, b: number, n: number): number => a + (b - a) * n;

export interface ZoomSliderCompProps {
  sliderData?: ZoomSliderItem[];
  title?: string;
  subheading?: string;
  scaleOnHover?: boolean;
  textOnHover?: boolean;
  size?: number;
  easeScrollPercentage?: number;
  className?: string;
  id?: string;
}

export function ZoomSliderComp({
  sliderData = DEFAULT_SLIDER_DATA,
  title = "Our Work",
  subheading,
  scaleOnHover = true,
  textOnHover = true,
  size = 1,
  easeScrollPercentage = 100,
  className = "",
  id,
}: ZoomSliderCompProps) {
  const images = sliderData;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(700);
  const [reduceMotion, setReduceMotion] = useState(false);

  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const isTablet =
    viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

  const resolvedSize = Math.max(0.5, Number(size) || 1);
  const resolvedEaseScrollPercentage = Math.max(20, Number(easeScrollPercentage) || 100);
  const cardWidthMin = (isMobile ? 75 : 190) * resolvedSize;
  const cardWidthMax = (isMobile ? 260 : isTablet ? 500 : 680) * resolvedSize;
  const cardHeightMax = isMobile
    ? Math.round(viewportHeight * 0.70 * resolvedSize)
    : Math.round(Math.max(620, (viewportHeight - 140) * resolvedSize));
  const cardHeightMin = (isMobile ? 85 : 70) * resolvedSize;
  const cardStep = cardWidthMax;

  const stateRef = useRef({
    current: 0,
    target: 0,
    raf: null as number | null,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    velocity: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const announcedIndexRef = useRef(0);

  useEffect(() => {
    const onResize = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = containerRef.current?.clientHeight || window.innerHeight;
      setViewportWidth(w);
      setViewportHeight(h);
    };

    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    );

    const syncReducedMotion = (event: MediaQueryList | MediaQueryListEvent) => {
      setReduceMotion(
        'matches' in event ? event.matches : prefersReducedMotion()
      );
    };

    if (!mediaQuery) return;

    syncReducedMotion(mediaQuery);
    mediaQuery.addEventListener('change', syncReducedMotion);
    return () => mediaQuery.removeEventListener('change', syncReducedMotion);
  }, []);

  const positionCards = useCallback(
    (offset: number) => {
      if (!stripRef.current) return;

      const cards = Array.from(stripRef.current.children) as HTMLElement[];
      const count = images.length;

      if (!count) return;

      const loopWidth = count * cardStep;
      const viewportWidthValue = containerRef.current?.clientWidth || window.innerWidth;
      const viewportHeightValue = containerRef.current?.clientHeight || window.innerHeight;
      const isMobileScreen = viewportWidthValue < MOBILE_BREAKPOINT;
      const bottomOffset = isMobileScreen ? 18 : 8;
      const bottom = viewportHeightValue - bottomOffset;
      const easingDistance = 2 * viewportWidthValue * (resolvedEaseScrollPercentage / 100);

      const mapVtoX = (value: number) => {
        if (value <= 0) return 0;
        if (value >= easingDistance) return value - easingDistance / 2;
        return (value * value) / (2 * easingDistance);
      };

      const normalizedOffset =
        ((offset % loopWidth) + loopWidth) % loopWidth;
      const startIndex = Math.floor(normalizedOffset / cardStep);
      const fractionalOffset = (normalizedOffset % cardStep) / cardStep;

      for (let index = 0; index < count; index += 1) {
        const cardIndex = (startIndex + index) % count;
        const visualOffset = (index - fractionalOffset) * cardStep;
        const currentX = mapVtoX(visualOffset);
        const nextX = mapVtoX(visualOffset + cardStep);
        const visualWidth = nextX - currentX;
        const scale = visualWidth / cardWidthMax;
        const cardHeight =
          cardHeightMin + scale * (cardHeightMax - cardHeightMin);
        const y = bottom - cardHeight;

        if (!cards[cardIndex]) continue;

        const baseGap = isMobile ? 8 : 12;
        const cardGap = Math.max(3, Math.round(baseGap * Math.min(1, Math.max(0.35, scale))));
        const cardWidth = Math.max(10, visualWidth - cardGap);

        cards[cardIndex].style.transform = `translate(${currentX}px, ${y}px)`;
        cards[cardIndex].style.width = `${cardWidth}px`;

        const imageWrap = imageWrapRefs.current[cardIndex];

        if (!imageWrap) continue;

        imageWrap.style.width = `${cardWidth}px`;
        imageWrap.style.height = `${cardHeight}px`;
      }
    },
    [cardHeightMax, cardHeightMin, cardStep, cardWidthMax, images.length, isMobile, resolvedEaseScrollPercentage]
  );

  useEffect(() => {
    if (!images.length) return;

    const state = stateRef.current;
    const loopWidth = images.length * cardStep;

    const tick = () => {
      // Momentum glide after the finger/pointer is released.
      if (
        !reduceMotion &&
        !state.isDragging &&
        Math.abs(state.velocity) > MIN_MOMENTUM
      ) {
        state.target += state.velocity;
        state.velocity *= MOMENTUM_FRICTION;
      } else if (!state.isDragging) {
        state.velocity = 0;
      }

      // Track tightly while actively dragging, glide smoothly otherwise.
      const lerpFactor = reduceMotion
        ? REDUCED_MOTION_LERP_FACTOR
        : state.isDragging
          ? DRAG_LERP_FACTOR
          : LERP_FACTOR;
      state.current = lerp(state.current, state.target, lerpFactor);

      if (Math.abs(state.current - state.target) < 0.01) {
        const shift = Math.round(state.current / loopWidth) * loopWidth;
        state.current -= shift;
        state.target -= shift;
      }

      positionCards(state.current);

      if (images.length) {
        const normalizedOffset =
          ((state.current % loopWidth) + loopWidth) % loopWidth;
        const nextIndex =
          Math.floor(normalizedOffset / cardStep) % images.length;

        if (nextIndex !== announcedIndexRef.current) {
          announcedIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      }

      state.raf = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      // If user is holding Shift (standard horizontal scroll gesture) or explicitly scrolling horizontally:
      if (event.shiftKey) {
        event.preventDefault();
        const delta = (event.deltaY || event.deltaX) * SCROLL_PER_PX;
        state.target -= delta;
      } else if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 3) {
        event.preventDefault();
        state.target -= event.deltaX * SCROLL_PER_PX;
      }
      // Normal vertical mouse wheel / trackpad scroll (event.deltaY) is NOT hijacked or prevented!
      // This allows the user to scroll smoothly through the page past the Work section to the rest of the website.
    };

    const beginDrag = (clientX: number, clientY: number) => {
      state.isDragging = true;
      state.lastX = clientX;
      state.lastY = clientY;
      state.velocity = 0;
    };

    const moveDrag = (clientX: number, direction: number = 1) => {
      if (!state.isDragging) return;

      const deltaX = clientX - state.lastX;
      // Only horizontal drag movement controls the horizontal card strip
      const delta = -deltaX * direction;

      state.target += delta;
      state.velocity = lerp(state.velocity, delta, 0.5);
      state.lastX = clientX;
    };

    const endDrag = () => {
      state.isDragging = false;
    };

    const onMouseDown = (event: MouseEvent) => beginDrag(event.clientX, event.clientY);
    const onMouseMove = (event: MouseEvent) => moveDrag(event.clientX, 1);
    const onMouseUp = endDrag;

    // Separate touch tracking to distinguish horizontal carousel swipe from vertical page scroll
    const touchTracking = {
      startX: 0,
      startY: 0,
      direction: null as 'horizontal' | 'vertical' | null,
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      const touch = event.touches[0];
      touchTracking.startX = touch.clientX;
      touchTracking.startY = touch.clientY;
      touchTracking.direction = null;
      beginDrag(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!event.touches[0] || !state.isDragging) return;
      const touch = event.touches[0];

      if (touchTracking.direction === null) {
        const diffX = Math.abs(touch.clientX - touchTracking.startX);
        const diffY = Math.abs(touch.clientY - touchTracking.startY);
        if (diffX > 7 || diffY > 7) {
          if (diffX >= diffY) {
            touchTracking.direction = 'horizontal';
          } else {
            touchTracking.direction = 'vertical';
            state.isDragging = false; // Vertical scroll: let page scroll naturally
          }
        }
      }

      if (touchTracking.direction === 'horizontal') {
        if (event.cancelable) {
          event.preventDefault();
        }
        moveDrag(touch.clientX, -1);
      }
      // If vertical, do not preventDefault and do not move slider
    };

    const onTouchEnd = () => {
      endDrag();
      touchTracking.direction = null;
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener('wheel', onWheel, { passive: false });
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('touchstart', onTouchStart, { passive: true });
      container.addEventListener('touchmove', onTouchMove, { passive: false });
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf as number);
      if (container) {
        container.removeEventListener('wheel', onWheel);
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [cardStep, images, positionCards, reduceMotion]);

  useEffect(() => {
    if (!images.length) return;

    const cleanups: (() => void)[] = [];

    cardRefs.current.forEach((card, index) => {
      const textElement = textRefs.current[index];
      const imageWrap = imageWrapRefs.current[index];

      if (!card || !textElement || !imageWrap) return;

      const numberElement = textElement.querySelector('[data-number]');
      const titleElement = textElement.querySelector('[data-title]');
      const descElement = textElement.querySelector('[data-desc]');

      if (!numberElement || !titleElement || !descElement) return;

      const split = SplitText.create(
        [numberElement, titleElement, descElement],
        {
          type: 'lines',
          mask: 'lines',
        }
      );

      gsap.set(split.lines, { yPercent: 100 });
      gsap.set(textElement, { autoAlpha: 0 });

      const imageElement = imageWrap.querySelector('img');

      if (imageElement) {
        gsap.set(imageElement, { opacity: 1 });
      }

      const onEnter = () => {
        if (textOnHover) {
          if (reduceMotion) {
            gsap.killTweensOf([textElement, split.lines]);
            gsap.set(split.lines, { yPercent: 0 });
            gsap.to(textElement, {
              autoAlpha: 1,
              duration: REDUCED_MOTION_FADE_DURATION,
              ease: 'power2.out',
            });
          } else {
            gsap
              .timeline()
              .set(textElement, { autoAlpha: 1 })
              .to(split.lines, {
                yPercent: 0,
                duration: 0.55,
                stagger: 0.05,
                ease: 'power3.out',
              });
          }
        }

        if (!imageElement || !scaleOnHover || reduceMotion) return;

        gsap.to(imageElement, {
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      const onLeave = () => {
        if (textOnHover) {
          if (reduceMotion) {
            gsap.killTweensOf([textElement, split.lines]);
            gsap.to(textElement, {
              autoAlpha: 0,
              duration: REDUCED_MOTION_FADE_DURATION,
              ease: 'power2.out',
              onComplete: () => gsap.set(split.lines, { yPercent: 100 }),
            });
          } else {
            gsap.to(split.lines, {
              yPercent: 100,
              duration: 0.28,
              stagger: 0.03,
              ease: 'power2.in',
              onComplete: () => gsap.set(textElement, { autoAlpha: 0 }),
            });
          }
        } else {
          gsap.killTweensOf([textElement, split.lines]);
          gsap.set(textElement, { autoAlpha: 0 });
          gsap.set(split.lines, { yPercent: 100 });
        }

        if (!imageElement || !scaleOnHover) return;

        gsap.to(imageElement, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      imageWrap.addEventListener('mouseenter', onEnter);
      imageWrap.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        imageWrap.removeEventListener('mouseenter', onEnter);
        imageWrap.removeEventListener('mouseleave', onLeave);
        split.revert();
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [images, reduceMotion, scaleOnHover, textOnHover]);

  const activeItem = images[activeIndex];
  const slideAnnouncement = images.length
    ? activeItem?.title
      ? `${activeItem.title}, slide ${activeIndex + 1} of ${images.length}`
      : `Slide ${activeIndex + 1} of ${images.length}`
    : '';

  const slideNext = () => {
    stateRef.current.target -= cardStep;
  };

  const slidePrev = () => {
    stateRef.current.target += cardStep;
  };

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-white dark:bg-black select-none transition-colors duration-200 h-[min(84vh,780px)] min-h-[620px] md:h-[min(98vh,1080px)] md:min-h-[880px] pb-4 ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {slideAnnouncement}
      </div>
      {title ? (
        <div className="pointer-events-none absolute left-1/2 top-6 sm:top-8 z-20 -translate-x-1/2 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.04em] text-zinc-950 dark:text-white transition-colors">
            {title}
          </h1>
          {subheading ? (
            <p className="mt-1.5 text-xs sm:text-sm tracking-[0.08em] text-zinc-500 dark:text-white/70 transition-colors">
              {subheading}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Discrete project navigation arrows */}
      <div className="absolute right-4 sm:right-8 top-6 sm:top-8 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={slidePrev}
          className="p-2 sm:p-2.5 rounded-full bg-zinc-100/90 hover:bg-zinc-200 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 transition-all cursor-pointer shadow-sm active:scale-95"
          aria-label="Previous project"
          title="Previous project"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={slideNext}
          className="p-2 sm:p-2.5 rounded-full bg-zinc-100/90 hover:bg-zinc-200 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 transition-all cursor-pointer shadow-sm active:scale-95"
          aria-label="Next project"
          title="Next project"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div ref={stripRef} className="absolute inset-0">
        {images.map((item, index) => (
          <div
            key={index}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
            style={{ willChange: 'transform' }}
          >
            <div
              ref={(element) => {
                textRefs.current[index] = element;
              }}
              className="absolute z-10 flex w-full flex-col gap-1.5 pointer-events-none"
              style={{
                bottom: 'calc(100% + 14px)',
                left: 0,
                padding: '0 0 4px',
                visibility: 'hidden',
              }}
            >
              <p
                data-number
                className="overflow-hidden select-none text-[11px] font-mono font-semibold uppercase leading-none tracking-[0.18em] text-zinc-500 dark:text-white/60"
              >
                {item.number}
              </p>

              <p
                data-title
                className="overflow-hidden select-none text-[15px] sm:text-[17px] font-bold uppercase leading-[1.15] tracking-[-0.01em] text-zinc-950 dark:text-white"
              >
                {item.title}
              </p>

              <p
                data-desc
                className="overflow-hidden text-[11px] sm:text-xs select-none font-normal leading-normal tracking-[-0.01em] text-zinc-600 dark:text-white/70"
              >
                {item.desc}
              </p>
            </div>

            <div
              ref={(element) => {
                imageWrapRefs.current[index] = element;
              }}
              className="relative overflow-hidden rounded-none shadow-xl dark:shadow-2xl bg-zinc-100 dark:bg-zinc-900"
              style={{
                width: cardWidthMin,
                height: cardHeightMax,
                willChange: 'width, height',
              }}
            >
              <img
                src={item.src}
                alt={item.title}
                draggable={false}
                className="pointer-events-none absolute inset-0 select-none object-cover opacity-0 w-full h-full rounded-none"
                style={{
                  transform: 'none',
                  objectPosition: 'center center',
                  transition: 'none',
                  willChange: 'auto',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ZoomSlider = ({
  sliderData = DEFAULT_SLIDER_DATA,
  title = "Our Work",
  subheading,
  scaleOnHover = true,
  textOnHover = true,
  size = 1,
  easeScrollPercentage = 100,
  className = "",
  id,
}: {
  sliderData?: ZoomSliderItem[];
  title?: string;
  subheading?: string;
  scaleOnHover?: boolean;
  textOnHover?: boolean;
  size?: number;
  easeScrollPercentage?: number;
  className?: string;
  id?: string;
} = {}) => (
  <ZoomSliderComp
    id={id}
    title={title}
    subheading={subheading}
    sliderData={sliderData}
    scaleOnHover={scaleOnHover}
    textOnHover={textOnHover}
    size={size}
    easeScrollPercentage={easeScrollPercentage}
    className={className}
  />
);

export default ZoomSlider;
