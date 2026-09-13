"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, Calendar } from "lucide-react"
import { useTheme } from "@/context/theme-context"

declare global {
  interface Window {
    Cal?: any
  }
}

interface LetsWorkTogetherProps {
  id?: string
  calLink?: string
}

export function LetsWorkTogether({
  id = "contact",
  calLink = "wovn-creatives/w",
}: LetsWorkTogetherProps) {
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  // Initialize and keep Cal embed up-to-date with active theme
  useEffect(() => {
    // Cal.com embed loader snippet
    ;(function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar)
      }
      const d = C.document
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal
          const ar = arguments
          if (!cal.loaded) {
            cal.ns = {}
            cal.q = cal.q || []
            const s = d.createElement("script")
            s.src = A
            s.async = true
            d.head.appendChild(s)
            cal.loaded = true
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments)
            }
            const namespace = ar[1]
            api.q = api.q || []
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api
              p(cal.ns[namespace], ar)
              p(cal, ["initNamespace", namespace])
            } else {
              p(cal, ar)
            }
            return
          }
          p(cal, ar)
        }
    })(window, "https://app.cal.com/embed/embed.js", "init")

    if (window.Cal) {
      window.Cal("init", "w", { origin: "https://app.cal.com" })
      window.Cal.config = window.Cal.config || {}
      window.Cal.config.forwardQueryParams = true

      // Update UI and theme styling for the popup
      if (window.Cal.ns && window.Cal.ns.w) {
        window.Cal.ns.w("ui", {
          theme: theme === "light" ? "light" : "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
          styles: {
            branding: {
              brandColor: theme === "light" ? "#09090b" : "#ffffff",
            },
          },
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#09090b",
              "cal-brand-emphasis": "#18181b",
              "cal-brand-text": "#ffffff",
            },
            dark: {
              "cal-brand": "#ffffff",
              "cal-brand-emphasis": "#f4f4f5",
              "cal-brand-text": "#09090b",
            },
          },
        })
      }
    }
  }, [theme])

  // Reset to initial state when user scrolls above the meeting area
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      if (rect.top > window.innerHeight * 0.7) {
        setIsClicked(false)
        setShowSuccess(false)
        setIsHovered(false)
        setIsButtonHovered(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    e.preventDefault()
    setIsClicked(true)

    setTimeout(() => {
      setShowSuccess(true)
    }, 500)
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative flex min-h-[90vh] sm:min-h-screen items-center justify-center px-6 py-24 sm:py-32 bg-background text-foreground transition-colors duration-500 overflow-hidden select-none"
    >
      <div className="relative flex flex-col items-center gap-12 w-full max-w-4xl mx-auto">
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: showSuccess ? 1 : 0,
            transform: showSuccess ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          {/* Heading without 'Perfect' label */}
          <div className="flex flex-col items-center gap-2">
            <h3
              className="text-3xl font-light tracking-tight text-foreground transition-all duration-500 sm:text-4xl"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "150ms",
              }}
            >
              Let's talk
            </h3>
          </div>

          {/* Book a call button configured with Cal.com element-click embed trigger */}
          <button
            data-cal-link={calLink}
            data-cal-namespace="w"
            data-cal-config={`{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"${theme === "light" ? "light" : "dark"}"}`}
            onClick={() => {
              // Programmatic fallback in case click event delegation isn't caught immediately
              if (window.Cal && window.Cal.ns && window.Cal.ns.w) {
                try {
                  window.Cal.ns.w("preload", { calLink })
                } catch {
                  // ignore
                }
              }
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative flex items-center gap-4 transition-all duration-500 cursor-pointer outline-none"
            style={{
              transform: showSuccess
                ? isButtonHovered
                  ? "translateY(0) scale(1.02)"
                  : "translateY(0) scale(1)"
                : "translateY(15px) scale(1)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "150ms",
            }}
            id="book-call-btn"
          >
            {/* Left line */}
            <div
              className="h-px w-8 bg-border transition-all duration-500 sm:w-12"
              style={{
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />

            {/* Button content */}
            <div
              className="relative flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 transition-all duration-500 sm:px-8 sm:py-4"
              style={{
                borderColor: isButtonHovered ? "var(--foreground)" : "var(--border)",
                backgroundColor: isButtonHovered ? "var(--foreground)" : "transparent",
                boxShadow: isButtonHovered ? "0 0 30px rgba(0,0,0,0.12), 0 10px 40px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Calendar
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? "var(--background)" : "var(--foreground)",
                }}
              />
              <span
                className="text-sm font-medium tracking-wide transition-all duration-500 sm:text-base"
                style={{
                  color: isButtonHovered ? "var(--background)" : "var(--foreground)",
                }}
              >
                Book a call
              </span>
              <ArrowUpRight
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? "var(--background)" : "var(--foreground)",
                  transform: isButtonHovered ? "translate(3px, -3px) scale(1.1)" : "translate(0, 0) scale(1)",
                }}
              />
            </div>

            {/* Right line */}
            <div
              className="h-px w-8 bg-border transition-all duration-500 sm:w-12"
              style={{
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />
          </button>

          {/* Subtle subtext */}
          <span
            className="text-xs tracking-widest uppercase text-muted-foreground/60 transition-all duration-500"
            style={{
              transform: showSuccess ? "translateY(0)" : "translateY(10px)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "300ms",
            }}
          >
            15 min intro call
          </span>
        </div>

        <div
          className="flex items-center gap-3 transition-all duration-500"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(-20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
            Available for projects
          </span>
        </div>

        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>)}
          style={{
            pointerEvents: isClicked ? "none" : "auto",
          }}
          id="trigger-lets-talk"
        >
          <div className="flex flex-col items-center gap-5">
            <h2
              className="relative text-center text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] sm:leading-[0.9] tracking-[-0.04em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(-40px) scale(0.95)" : "translateY(0) scale(1)",
              }}
            >
              <span className="block overflow-hidden pt-0.5 pb-1">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-6%)" : "translateY(0)",
                  }}
                >
                  Let's work
                </span>
              </span>
              <span className="block overflow-hidden pt-0.5 pb-2">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-6%)" : "translateY(0)",
                  }}
                >
                  <span className="text-muted-foreground/60">together</span>
                </span>
              </span>
            </h2>

            {/* Circular Arrow button with persistent pulse and hover animations */}
            <div className="relative mt-1 flex size-16 items-center justify-center sm:size-20">
              {/* Subtle ambient ripple effect */}
              <div
                className={`absolute inset-0 rounded-full border border-current pointer-events-none transition-opacity duration-500 ${
                  isClicked ? "opacity-0" : isHovered ? "opacity-30 scale-125" : "animate-ping opacity-15"
                }`}
              />

              <div
                className="pointer-events-none absolute inset-0 rounded-full border transition-all ease-out"
                style={{
                  borderColor: isClicked ? "var(--foreground)" : isHovered ? "var(--foreground)" : "var(--border)",
                  backgroundColor: isClicked ? "transparent" : isHovered ? "var(--foreground)" : "transparent",
                  transform: isClicked ? "scale(3)" : isHovered ? "scale(1.12)" : "scale(1)",
                  opacity: isClicked ? 0 : 1,
                  transitionDuration: isClicked ? "700ms" : "500ms",
                }}
              />
              <div className="relative overflow-hidden flex items-center justify-center size-7 sm:size-8">
                {/* Primary arrow */}
                <ArrowUpRight
                  className="size-6 sm:size-7 transition-all ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isClicked
                      ? "translate(100px, -100px) scale(0.5)"
                      : isHovered
                        ? "translate(3px, -3px)"
                        : "translate(0, 0)",
                    opacity: isClicked ? 0 : 1,
                    color: isHovered && !isClicked ? "var(--background)" : "var(--foreground)",
                    transitionDuration: isClicked ? "600ms" : "400ms",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:-left-16 pointer-events-none">
            <div
              className="h-px w-8 bg-border transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked ? "scaleX(0) translateX(-20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 sm:-right-16 pointer-events-none">
            <div
              className="h-px w-8 bg-border transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked ? "scaleX(0) translateX(20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
