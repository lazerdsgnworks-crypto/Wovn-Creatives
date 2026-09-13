import React from "react";
import { useTheme } from "@/context/theme-context";
import { useWebsiteData } from "@/context/website-data-context";
import { Lock } from "lucide-react";

export type AppPage = "home" | "our-work" | "chat" | "contact" | "privacy" | "terms" | "payments" | "faqs" | "admin";

interface Footer16Props {
  onNavigate?: (page: AppPage) => void;
}

const navLinks = [
  { label: "Contact", page: "contact" as const },
  { label: "Privacy Policy", page: "privacy" as const },
  { label: "Terms & Conditions", page: "terms" as const },
  { label: "Payments & Refunds", page: "payments" as const },
  { label: "FAQs", page: "faqs" as const },
];

export default function Footer16({ onNavigate }: Footer16Props) {
  const { theme } = useTheme();
  const { data } = useWebsiteData();
  const year = new Date().getFullYear();

  const linkedinUrl = data?.settings?.linkedinUrl || "https://www.linkedin.com/company/wovn-studios/";
  const instagramUrl = data?.settings?.instagramUrl || "https://www.instagram.com/wovncreatives";
  const xUrl = data?.settings?.xUrl || "https://x.com/wovncreatives";
  const phone = (data?.settings?.phone || "+92 300 1234567").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phone || "923001234567"}?text=${encodeURIComponent(
    "Hi Wovn Creatives! I'd like to discuss a project."
  )}`;

  const socials = [
    {
      label: "X",
      href: xUrl,
      path: "M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.7 21H1.5l7.5-8.5L1.1 3h6.5l4.5 6 5.4-6Zm-1.1 16h1.8L7.6 4.9H5.7L16.4 19Z",
    },
    {
      label: "Instagram",
      href: instagramUrl,
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
      label: "LinkedIn",
      href: linkedinUrl,
      path: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8h4.56v15H.22V8Zm7.66 0h4.37v2.05h.06c.61-1.16 2.1-2.38 4.33-2.38 4.62 0 5.47 3.04 5.47 7v8.33h-4.56v-7.39c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V23H7.88V8Z",
    },
    {
      label: "WhatsApp",
      href: whatsappUrl,
      path: "M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z",
    },
  ];

  const handleNavClick = (
    e: React.MouseEvent,
    page: AppPage
  ) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white dark:bg-[#070709] text-zinc-950 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors duration-500 font-sans tracking-[-0.02em]">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate("home");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3 font-semibold tracking-tight hover:opacity-80 transition-opacity cursor-pointer text-zinc-950 dark:text-white"
            aria-label="WOVN Home"
          >
            <div className="relative h-9 sm:h-10 w-20 sm:w-24 flex items-center">
              <img
                src="https://i.ibb.co/Mxwyd6vs/WOVN-STUDIO-GRID-3.png"
                alt="WOVN STUDIO GRID"
                className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ${
                  theme === "dark" ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                loading="lazy"
              />
              <img
                src="https://i.ibb.co/fGKVkSqJ/WOVN-STUDIO-GRID-2.png"
                alt="WOVN STUDIO GRID"
                className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ${
                  theme === "light" ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                loading="lazy"
              />
            </div>
          </a>

          <nav className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={(e) => handleNavClick(e, link.page)}
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white cursor-pointer font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800/80" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 w-full pt-1">
            <p className="text-center sm:text-left">
              &copy; {year} Wovn Creatives. All rights reserved. Effective September 2026.
            </p>
            <button
              onClick={(e) => handleNavClick(e, "admin")}
              className="inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity text-[11px] font-mono hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              title="Team Admin Portal"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
