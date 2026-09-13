"use client";

import React from "react";
import {
  Compass,
  Layers,
  Code2,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import RadialOrbitalTimeline, {
  TimelineItem,
} from "@/components/ui/radial-orbital-timeline";

const BUILD_TIMELINE_DATA: TimelineItem[] = [
  {
    id: 1,
    title: "Discovery & Strategy",
    date: "Days 01-03",
    content:
      "Comprehensive market audit, business goals, target audience research, strategic positioning, and locked scope roadmap.",
    category: "Strategy",
    icon: Compass,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Design & Identity",
    date: "Weeks 01-02",
    content:
      "Design concepts, interactive wireframes, bespoke kinetic visual systems, and comprehensive content direction.",
    category: "Design",
    icon: Layers,
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Build & Production",
    date: "Weeks 02-04",
    content:
      "Full-stack web build, 60FPS fluid motion, content production, campaign assets, and cross-browser QA testing.",
    category: "Production",
    icon: Code2,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 4,
    title: "Launch, Polish & Growth",
    date: "Handover & Scale",
    content:
      "Zero-downtime deployment, team training & SOPs, analytics tracking configuration, and iterative enhancements.",
    category: "Growth",
    icon: Rocket,
    relatedIds: [3, 5],
    status: "pending",
    energy: 50,
  },
  {
    id: 5,
    title: "Deliver to Client",
    date: "Handoff & Partnership",
    content:
      "Complete code ownership transfer, production sign-off, live video walkthroughs, and continuous scaling support.",
    category: "Delivery",
    icon: CheckCircle2,
    relatedIds: [4],
    status: "pending",
    energy: 25,
  },
];

interface HowItWorksSectionProps {
  id?: string;
  calLink?: string;
}

export function HowItWorksSection({
  id = "how-it-works",
}: HowItWorksSectionProps) {
  return (
    <section
      id={id}
      className="relative w-full bg-white dark:bg-black text-zinc-900 dark:text-white py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden transition-colors duration-500"
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header - Centered with reduced gap */}
        <div className="mb-2 sm:mb-4 text-center flex justify-center items-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter text-zinc-950 dark:text-white leading-[0.95] text-center transition-colors duration-300">
            How We <span className="text-zinc-400 dark:text-zinc-600">Build.</span>
          </h2>
        </div>

        {/* Radial Orbital Timeline Container - Seamless background */}
        <div className="w-full overflow-hidden relative">
          <RadialOrbitalTimeline timelineData={BUILD_TIMELINE_DATA} />
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
