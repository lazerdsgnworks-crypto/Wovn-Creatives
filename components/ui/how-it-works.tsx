"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Layers,
  Code2,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Zap,
  ShieldCheck,
  Terminal,
  Cpu,
  Eye,
  Sliders,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/context/theme-context";

interface ProcessStep {
  id: string;
  number: string;
  badge: string;
  timeline: string;
  title: string;
  headline: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  tag: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "discovery",
    number: "01",
    badge: "PHASE 01 • STRATEGY",
    timeline: "Days 01 – 03",
    title: "Discovery & Blueprint",
    headline: "Uncovering your distinctive edge and defining the architectural roadmap.",
    description:
      "We dive deep into your brand's core purpose, competitive vectors, and target audience psychology. No generic assumptions—just rigorous strategic clarity and technical scoping before writing a single line of code or designing a frame.",
    icon: Compass,
    accent: "#3b82f6", // Electric Blue
    tag: "THE BLUEPRINT",
    deliverables: [
      "1:1 Strategy & Scope Workshop directly with Studio Founders",
      "Competitive Landscape & Market Category Gap Audit",
      "Creative Direction Moodboards, Art Direction & Design Tokens",
      "Detailed Architecture Map, Technical Stack & Milestone Schedule",
    ],
    metrics: [
      { label: "Turnaround", value: "72 Hours" },
      { label: "Deliverable", value: "Full Blueprint" },
      { label: "Alignment", value: "100% Locked" },
    ],
  },
  {
    id: "design",
    number: "02",
    badge: "PHASE 02 • IDENTITY & UX",
    timeline: "Weeks 01 – 02",
    title: "Design & Kinetic Identity",
    headline: "Translating concepts into high-fidelity design systems and bespoke spatial motion.",
    description:
      "We craft an unmistakable aesthetic vocabulary tailored to your brand. From fluid wireframes to 3D spatial visuals, typography hierarchies, and responsive micro-interactions, every detail is engineered to captivate and convert.",
    icon: Layers,
    accent: "#a855f7", // Violet Kinetic
    tag: "THE CRAFT",
    deliverables: [
      "Complete Brand Identity (Primary Marks, Monograms & Badges)",
      "Interactive Framer / Figma High-Fidelity Prototypes",
      "Bespoke 3D Spatial Assets, CGI Visuals & Kinetic Motion Systems",
      "Comprehensive Component Design System & Style Guidelines",
    ],
    metrics: [
      { label: "Fidelity", value: "Pixel-Perfect" },
      { label: "Prototypes", value: "Fully Interactive" },
      { label: "Feedback", value: "24-48h Sprints" },
    ],
  },
  {
    id: "engineering",
    number: "03",
    badge: "PHASE 03 • DEVELOPMENT",
    timeline: "Weeks 02 – 04",
    title: "Full-Stack Engineering & AI",
    headline: "Writing clean, high-performance code integrated with smart AI workflows.",
    description:
      "Designs are transformed into blazing-fast digital realities. Utilizing modern React, Next.js, and Framer architectures with fluid shaders, responsive breakpoints, and automated AI pipelines that turn your website into an active revenue engine.",
    icon: Code2,
    accent: "#10b981", // Emerald Matrix
    tag: "THE BUILD",
    deliverables: [
      "High-Performance Frontend & Scalable API Integrations",
      "Fluid 60FPS Kinetic Motion, Smooth Scroll & Shader Effects",
      "Intelligent AI Workflows, Lead Capture & Custom Assistant Agents",
      "Rigorous Cross-Browser, Mobile & High-DPI Display Optimization",
    ],
    metrics: [
      { label: "Performance", value: "99+ Lighthouse" },
      { label: "Architecture", value: "Modern Stack" },
      { label: "AI Workflows", value: "24/7 Automated" },
    ],
  },
  {
    id: "launch",
    number: "04",
    badge: "PHASE 04 • LAUNCH & SCALE",
    timeline: "Handover & Scale",
    title: "Polish, Launch & Growth",
    headline: "Zero-downtime deployment, technical SEO perfection, and continuous evolution.",
    description:
      "We don't just hand over code—we ensure your launch makes waves. We conduct end-to-end stress tests, configure production domains and security, provide video walkthroughs for your team, and stay on standby for post-launch scaling.",
    icon: Rocket,
    accent: "#f59e0b", // Amber Launch
    tag: "THE EVOLUTION",
    deliverables: [
      "Production Deployment, Custom DNS & SSL Security Configuration",
      "Technical SEO Optimization, OpenGraph Assets & Social Cards",
      "Full Team Video SOPs, CMS Access & Ownership Handover",
      "Post-Launch Growth Retainer, Analytics Audits & Continuous Support",
    ],
    metrics: [
      { label: "Deployment", value: "Zero Downtime" },
      { label: "Ownership", value: "100% Yours" },
      { label: "Support", value: "Ongoing Care" },
    ],
  },
];

interface HowItWorksSectionProps {
  id?: string;
  calLink?: string;
}

export function HowItWorksSection({
  id = "how-it-works",
  calLink = "wovn-creatives/w",
}: HowItWorksSectionProps) {
  const { theme } = useTheme();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const activeStep = PROCESS_STEPS[activeStepIndex];

  // Auto-advance tabs if user enables it or leaves it idle
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const calUrl = calLink ? `https://cal.com/${calLink}` : "https://cal.com/wovn-creatives/w";

  return (
    <section
      id={id}
      className="relative w-full bg-white dark:bg-[#070709] py-24 sm:py-32 px-6 md:px-12 lg:px-16 overflow-hidden transition-colors duration-500 border-t border-zinc-200/80 dark:border-zinc-800/80"
    >
      {/* Subtle Atmospheric Grid & Ambient Radial Lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://cdn.21st.dev/assets/localized/3c2cc307b5ac6a906361df25133b605d31812b016296bfa912355817c768d347.svg')] opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Monospace Phase Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-[11px] font-mono tracking-wider uppercase text-zinc-600 dark:text-zinc-400 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>The Wovn Protocol</span>
                <span className="text-zinc-400 dark:text-zinc-600">•</span>
                <span>4-Phase Creative System</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter text-zinc-950 dark:text-white leading-[0.95]">
                How We <span className="text-zinc-400 dark:text-neutral-600">Build.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              A deliberate, friction-free creative pipeline designed to take bold ideas from initial
              strategy to iconic, category-defining production in weeks—not months.
            </p>
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-neutral-800/80 mt-8" />
        </div>

        {/* Phase Navigation Tabs - Desktop & Tablet */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsAutoPlaying(false);
                }}
                className={`relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-zinc-900 dark:text-white border-zinc-900 dark:border-zinc-700 shadow-xl shadow-black/10 dark:shadow-black/40 scale-[1.01]"
                    : "bg-zinc-50/70 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40"
                }`}
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono tracking-tight uppercase opacity-70">
                    {step.timeline}
                  </span>
                </div>

                {/* Step Title & Icon */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-sm sm:text-base leading-tight truncate">
                    {step.title}
                  </h3>
                </div>

                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeProcessTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-200 via-white to-zinc-400 dark:from-zinc-400 dark:via-white dark:to-zinc-300"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Phase Interactive Stage / Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 md:p-10 rounded-3xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/90 dark:border-zinc-800/90 backdrop-blur-xl shadow-2xl"
          >
            {/* Left Column: Deep Phase Details & Deliverables */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Micro Meta Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs tracking-wider uppercase px-2.5 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold">
                    {activeStep.badge}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                    // {activeStep.tag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-zinc-950 dark:text-white leading-tight mb-4">
                  {activeStep.headline}
                </h3>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-8">
                  {activeStep.description}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500 font-medium">
                    Key Phase Deliverables:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeStep.deliverables.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Metric Strip & CTAs */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {activeStep.metrics.map((metric, mi) => (
                    <div key={mi} className="flex flex-col">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                        {metric.label}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Start This Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Stage Simulation & Interactive Blueprint */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-full rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-inner relative">
                {/* Stage Header Controls */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800/80 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                    <span className="ml-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                      wovn://protocol/{activeStep.id}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">LIVE STAGE</span>
                </div>

                {/* Stage Specific Interactive Visual Mock */}
                <div className="my-6 flex-1 flex flex-col justify-center">
                  {activeStepIndex === 0 && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                          <span>SCOPE ARCHITECTURE</span>
                          <span className="text-emerald-500 font-semibold">100% READY</span>
                        </div>
                        <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                          <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                            <span>Core Objective</span>
                            <span className="font-semibold text-zinc-950 dark:text-white">
                              Market Differentiation
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                            <span>Target Horizon</span>
                            <span className="font-semibold text-zinc-950 dark:text-white">
                              Global Digital Product
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span>Lead Direction</span>
                            <span className="font-semibold text-zinc-950 dark:text-white">
                              Umar & Uzair Arif
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <div className="text-[10px] text-zinc-400">MOODBOARD</div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                            Curated & Approved
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <div className="text-[10px] text-zinc-400">SPRINT CYCLE</div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                            3-Day Launchpad
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStepIndex === 1 && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2.5">
                          <span>DESIGN TOKENS & KINETICS</span>
                          <span className="text-purple-500 font-semibold">FIGMA / FRAMER</span>
                        </div>
                        {/* Interactive Design Palette Swatches */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-7 flex-1 rounded-lg bg-zinc-950 border border-zinc-700 flex items-center justify-center text-[9px] font-mono text-zinc-400">
                            #070709
                          </div>
                          <div className="h-7 flex-1 rounded-lg bg-zinc-800 border border-zinc-600 flex items-center justify-center text-[9px] font-mono text-zinc-300">
                            #27272A
                          </div>
                          <div className="h-7 flex-1 rounded-lg bg-white border border-zinc-300 flex items-center justify-center text-[9px] font-mono text-zinc-900">
                            #FFFFFF
                          </div>
                          <div className="h-7 flex-1 rounded-lg bg-purple-600 border border-purple-400 flex items-center justify-center text-[9px] font-mono text-white">
                            #A855F7
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                          <span>Typography Hierarchy</span>
                          <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                            Plus Jakarta • Light 800
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-purple-500" />
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            3D Spatial Motion Shaders
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          Active 60FPS
                        </span>
                      </div>
                    </div>
                  )}

                  {activeStepIndex === 2 && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-200 border border-zinc-800 shadow-md">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3 h-3 text-emerald-400" />
                            <span>terminal@wovn-engine</span>
                          </span>
                          <span className="text-emerald-400">RUNNING</span>
                        </div>
                        <div className="mt-2.5 space-y-1 text-[11px] font-mono text-zinc-300">
                          <p className="text-zinc-400">
                            $ npm run deploy:production --optimized
                          </p>
                          <p className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Compiled in 1.4s (React + Vite + Shaders)
                          </p>
                          <p className="text-cyan-400 flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> AI Automation Pipelines: 4 active
                          </p>
                          <p className="text-zinc-400">
                            Lighthouse: Performance <span className="text-emerald-400">100</span> | SEO{" "}
                            <span className="text-emerald-400">100</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <div className="text-[10px] text-zinc-400">ZERO LAYOUT SHIFT</div>
                          <div className="text-xs font-semibold text-emerald-500 mt-0.5">
                            CLS: 0.00
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <div className="text-[10px] text-zinc-400">TIME TO INTERACTIVE</div>
                          <div className="text-xs font-semibold text-emerald-500 mt-0.5">
                            &lt; 0.3s
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStepIndex === 3 && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2.5">
                          <span>DEPLOYMENT CHECKLIST</span>
                          <span className="text-amber-500 font-semibold font-mono">100% AUDITED</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Custom Domain & SSL Provisioning</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>OpenGraph Metadata & Global CDN</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Client SOPs & Video Documentation</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Zero-Downtime Live Switch</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center justify-between">
                        <span className="font-medium">System Status</span>
                        <span className="font-mono font-semibold">PRODUCTION LIVE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Studio Quality Footnote */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>WOVN QUALITY ASSURANCE</span>
                  <span>ZERO COOKIE-CUTTER TEMPLATES</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Studio Guarantees Banner */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-950 dark:text-white">
                Rapid Velocity
              </h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                2 to 4 weeks average delivery
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-950 dark:text-white">
                24h Async Feedback
              </h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Direct Slack & Loom updates
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-950 dark:text-white">
                Founder-Led Execution
              </h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Zero junior handoffs or outsources
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-zinc-950 dark:text-white">
                100% Bespoke Code
              </h5>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Crafted from first principles
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
