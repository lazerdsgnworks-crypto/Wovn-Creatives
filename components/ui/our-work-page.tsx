"use client";

import * as React from "react";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { useWebsiteData } from "@/context/website-data-context";

interface OurWorkPageProps {
  onNavigateHome?: () => void;
  calLink?: string;
  items?: HeroCarouselItem[];
}

export const WORK_ITEMS: HeroCarouselItem[] = [
  {
    id: "aura-iridescent",
    title: "Aura\nAtmosphere",
    image: "https://i.ibb.co/m5R73btf/hf-20260912-193317-f5868bff-6646-42b1-94d8-e4edcba52484.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2026", "3D & SPATIAL", "GLOBAL LAUNCH"],
    accent: "#7b61ff",
  },
  {
    id: "flora-botanica",
    title: "Flora\nArchitecture",
    image: "https://i.ibb.co/QvYGTRsn/hf-20260912-194151-55ce9bd5-8fe5-40e7-b570-118cd200b1f6.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2026", "SPATIAL BOTANY", "PARIS"],
    accent: "#00c8ff",
  },
  {
    id: "form-chrome",
    title: "Form &\nStructure",
    image: "https://i.ibb.co/Wp6dXt2Z/hf-20260912-193317-96734949-14ed-49e4-a089-8e920589b2b0.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2026", "CHROME KINETICS", "RED DOT '26"],
    accent: "#ff4114",
  },
  {
    id: "flow-motion",
    title: "Spatial\nFlow",
    image: "https://i.ibb.co/Z1bp74TR/hf-20260912-191155-5f71e124-8e87-42bc-8b86-1cff2150b5d0.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2025", "MOTION GRAPHICS", "+6.4M REACH"],
    accent: "#2f7bff",
  },
  {
    id: "depth-dimension",
    title: "Dimensional\nDepth",
    image: "https://i.ibb.co/KzfwqN8C/hf-20260912-191255-78bb3dd2-f71b-435f-9c64-55cd88dc29fe.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2025", "IMMERSIVE SPATIAL", "TOKYO"],
    accent: "#4356c8",
  },
  {
    id: "energy-temporal",
    title: "Temporal\nEnergy",
    image: "https://i.ibb.co/rRt0gSH8/hf-20260912-191457-5b20f26b-8f37-401e-862a-e1ef62e02a63.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2025", "GENERATIVE 3D", "BERLIN"],
    accent: "#ff2f9c",
  },
  {
    id: "glitch-distortion",
    title: "Digital\nDistortion",
    image: "https://i.ibb.co/WNcJNZmd/hf-20260912-192806-549bed52-0312-4da7-9f03-204a384a215e.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2024", "EXPERIMENTAL CGI", "LONDON"],
    accent: "#e5231b",
  },
  {
    id: "prism-spectral",
    title: "Spectral\nHorizon",
    image: "https://i.ibb.co/NdjnKbwy/hf-20260912-193056-2a68be59-2b90-4b50-b553-c64e14ce4419.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2024", "KINETIC OPTICS", "NEW YORK"],
    accent: "#ff8c00",
  },
  {
    id: "pulse-cybernetic",
    title: "Cybernetic\nPulse",
    image: "https://i.ibb.co/GfwPZrZC/hf-20260912-193857-676dccef-3441-445d-b269-8fcf6201c675.png",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
    meta: ["2024", "REALTIME VISUALS", "SEOUL"],
    accent: "#00e5a3",
  },
];

export function OurWorkPage({ onNavigateHome, items }: OurWorkPageProps) {
  const { data } = useWebsiteData();
  const carouselItems: HeroCarouselItem[] =
    items ||
    (data?.projects && data.projects.length > 0
      ? data.projects.map((p) => ({
          id: p.id,
          title: p.title.replace(" ", "\n"),
          image: p.image,
          credit: p.credit || "WOVN CREATIVES",
          creditUrl: p.creditUrl || "https://www.instagram.com/wovncreatives",
          meta: p.meta || ["2026", "PORTFOLIO"],
          accent: p.accent || "#7b61ff",
        }))
      : WORK_ITEMS);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white select-none">
      <HeroCarousel
        items={carouselItems}
        defaultIndex={0}
        className="h-full w-full"
      />
    </div>
  );
}
