"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Minus, Plus, ExternalLink } from "lucide-react";
import { useWebsiteData } from "@/context/website-data-context";

/* ---------- Types ---------- */

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  link: string;
}

/* ---------- Data ---------- */

const TEAM: TeamMember[] = [
  {
    id: "01",
    name: "Umar Arif",
    role: "Founder",
    image:
      "https://i.ibb.co/HfZbHm5k/4c5e4fd1-526f-421e-a503-b5cd69d2a6fb.jpg",
    link: "https://www.linkedin.com/in/umar-arif-92349537a/",
  },
  {
    id: "02",
    name: "Uzair Arif",
    role: "Co-Founder",
    image:
      "https://i.ibb.co/0RZNjwx9/FD5-C8372-961-E-4234-AFEE-D9-FF4-D3-AEA40.png",
    link: "https://www.linkedin.com/in/uzair-arif-221637423/",
  },
  {
    id: "03",
    name: "Abdul Raheem",
    role: "Senior Designer",
    image:
      "https://i.ibb.co/HLGfBWyn/fc51b2b7-dca4-4e3b-ba4e-628f9def461d.jpg",
    link: "https://www.instagram.com/dirbyraheem_?stkn=bGRtZ2R6cXc0NXpk",
  },
  {
    id: "04",
    name: "Muhammad Saad",
    role: "UI/UX & Development",
    image:
      "https://i.ibb.co/7J3zrqnP/IMG-2772.png",
    link: "https://www.linkedin.com/in/hafizsaad-design?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    id: "05",
    name: "Abdullah Shahid",
    role: "Full Stack Developer",
    image:
      "https://i.ibb.co/MDBw0fpv/IMG-2771.png",
    link: "https://www.linkedin.com/in/abdullah-shahid-a61175336?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
];

/* ---------- Main Component ---------- */

export function KineticTeamHybrid() {
  const { data } = useWebsiteData();
  const teamList = data?.team && data.team.length > 0 ? data.team : TEAM;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position resources (Global for the floating card)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics for the floating card
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Detect mobile for conditional rendering logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    // Offset the cursor card so it doesn't block the text
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  const activeMember = teamList.find((t) => t.id === activeId);

  return (
    <div
      id="team"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full cursor-default bg-white dark:bg-neutral-950 px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-zinc-900 dark:text-neutral-200 md:px-12 transition-colors duration-500"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://cdn.21st.dev/assets/localized/3c2cc307b5ac6a906361df25133b605d31812b016296bfa912355817c768d347.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />

      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 md:mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-light tracking-tighter text-zinc-950 dark:text-white sm:text-6xl md:text-8xl">
              Wovn <span className="text-zinc-400 dark:text-neutral-600">Team</span>
            </h1>
          </div>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-neutral-900 mx-8 hidden md:block" />
        </motion.header>

        {/* The List */}
        <div className="flex flex-col">
          {teamList.map((member, index) => (
            <TeamRow
              key={member.id}
              data={member}
              index={index}
              isActive={activeId === member.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP ONLY: Global Floating Cursor Image */}
      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeMember && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative h-64 w-80 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-2xl"
              >
                {/* Active image */}
                <img
                  src={activeMember.image}
                  alt={activeMember.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />

                {/* Overlay Metadata */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/90">
                        {activeMember.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider flex items-center gap-1">
                      <span>Profile</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Row Component ---------- */

interface TeamRowProps {
  key?: React.Key;
  data: TeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
}

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}: TeamRowProps) {
  const isDimmed = isAnyActive && !isActive;

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      setActiveId(isActive ? null : data.id);
    } else {
      window.open(data.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      layout // This enables smooth height animation on mobile
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        y: 0,
        backgroundColor:
          isActive && isMobile
            ? "rgba(0,0,0,0.03)"
            : "transparent",
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={handleClick}
      className={`group relative border-t border-zinc-200 dark:border-neutral-900 transition-colors duration-500 last:border-b cursor-pointer`}
    >
      <div className="relative z-10 flex flex-col py-5 sm:py-7 md:flex-row md:items-center md:justify-between md:py-12">
        {/* Name & Index Section */}
        <div className="flex items-baseline gap-6 md:gap-12 pl-4 md:pl-0 transition-transform duration-500 group-hover:translate-x-4">
          <span className="font-mono text-xs text-zinc-400 dark:text-neutral-600">
            0{index + 1}
          </span>
          <h2 className="text-3xl font-medium tracking-tight text-zinc-600 dark:text-neutral-400 transition-colors duration-300 group-hover:text-zinc-950 dark:group-hover:text-white md:text-6xl">
            {data.name}
          </h2>
        </div>

        {/* Role & Icon Section */}
        <div className="mt-4 flex items-center justify-between pl-12 pr-4 md:mt-0 md:justify-end md:gap-12 md:pl-0 md:pr-0">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-neutral-600 transition-colors group-hover:text-zinc-800 dark:group-hover:text-neutral-400">
            {data.role}
          </span>

          {/* Mobile Toggle Icon */}
          <div className="block md:hidden text-zinc-400 dark:text-neutral-500">
            {isActive ? <Minus size={18} /> : <Plus size={18} />}
          </div>

          {/* Desktop Arrow Link */}
          <motion.div
            animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
            className="hidden md:block text-zinc-950 dark:text-white"
          >
            <ArrowUpRight size={28} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* MOBILE ONLY: Inline Accordion Image & Profile Link */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-zinc-100/80 dark:bg-neutral-900/50"
          >
            <div className="p-4">
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block relative aspect-video w-full overflow-hidden rounded-lg group/mobile-img"
              >
                <img
                  src={data.image}
                  alt={data.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/mobile-img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold">
                      View Profile
                    </p>
                    <p className="text-[10px] text-white/70 font-mono">
                      {data.role}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default KineticTeamHybrid;
