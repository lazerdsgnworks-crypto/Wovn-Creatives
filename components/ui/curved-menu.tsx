"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence, type Variants } from "framer-motion";
import { Linkedin, Instagram, Calendar, Mail, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export interface iNavItem {
  heading: string;
  href: string;
  subheading?: string;
  imgSrc?: string;
  onClick?: () => void;
}

export interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
  theme?: "dark" | "light";
}

export interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
  theme?: "dark" | "light";
  footer?: React.ReactNode;
}

export interface iHeaderProps {
  navItems?: iNavItem[];
  footer?: React.ReactNode;
  onNavigate?: (page: "home" | "our-work" | "chat" | "contact" | "services") => void;
  className?: string;
}

const MENU_SLIDE_ANIMATION: Variants = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const defaultNavItems: iNavItem[] = [
  {
    heading: "Home",
    href: "#hero-top",
    subheading: "Return to beginning",
    imgSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    heading: "Work",
    href: "#our-work",
    subheading: "Selected client case studies",
    imgSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
  {
    heading: "Services",
    href: "#services",
    subheading: "What we craft and build",
    imgSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
  },
  {
    heading: "Chat",
    href: "#chat",
    subheading: "Interactive studio assistant",
    imgSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    heading: "Contact",
    href: "#contact",
    subheading: "Get in touch with us",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
];

const CustomFooter: React.FC<{ theme?: "dark" | "light" }> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const iconColor = isDark
    ? "text-zinc-400 hover:text-white"
    : "text-zinc-600 hover:text-black";

  return (
    <div
      className={`flex w-full text-sm justify-between px-8 sm:px-12 md:px-20 py-6 border-t ${
        isDark ? "border-zinc-800/80 text-zinc-400" : "border-zinc-200/80 text-zinc-600"
      }`}
    >
      <a
        href="https://www.linkedin.com/company/wovn-studios/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={`transition-colors p-1 ${iconColor}`}
      >
        <Linkedin size={20} />
      </a>
      <a
        href="https://www.instagram.com/wovncreatives"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={`transition-colors p-1 ${iconColor}`}
      >
        <Instagram size={20} />
      </a>
      <a
        href="https://x.com/wovncreatives"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X"
        className={`transition-colors p-1 ${iconColor}`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.7 21H1.5l7.5-8.5L1.1 3h6.5l4.5 6 5.4-6Zm-1.1 16h1.8L7.6 4.9H5.7L16.4 19Z" />
        </svg>
      </a>
      <a
        href="https://cal.com/wovn-creatives/w"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book Discovery Call"
        className={`transition-colors p-1 ${iconColor}`}
      >
        <Calendar size={20} />
      </a>
      <a
        href="mailto:wovn.hq@gmail.com"
        aria-label="Email WOVN"
        className={`transition-colors p-1 ${iconColor}`}
      >
        <Mail size={20} />
      </a>
    </div>
  );
};

const NavLink: React.FC<iNavLinkProps> = ({
  heading,
  href,
  onClick,
  setIsActive,
  index,
  theme = "dark",
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const isDark = theme === "dark";

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    setIsActive(false);
  };

  const isExternalLink = href.startsWith("http");
  const linkProps = isExternalLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const borderColor = isDark ? "border-zinc-800" : "border-black/20";
  const numberColor = isDark ? "text-zinc-500" : "text-black/40";
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="whileHover"
      className={`group relative flex items-center justify-between border-b ${borderColor} py-3.5 sm:py-4 transition-colors duration-500 uppercase cursor-pointer select-none`}
    >
      <a
        ref={ref}
        onMouseMove={handleMouseMove}
        href={href}
        className="w-full no-underline"
        {...linkProps}
      >
        <div className="relative flex items-baseline">
          <span
            className={`transition-colors duration-500 text-2xl sm:text-3xl font-light mr-3 sm:mr-4 ${numberColor}`}
          >
            0{index}.
          </span>
          <div className="flex flex-row gap-1 sm:gap-2">
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: -8 },
              }}
              transition={{
                type: "spring",
                staggerChildren: 0.05,
                delayChildren: 0.15,
              }}
              className={`relative z-10 block text-2xl sm:text-3xl md:text-4xl font-light tracking-tight transition-colors duration-500 ${textColor}`}
            >
              {heading.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  variants={{
                    initial: { x: 0 },
                    whileHover: { x: 8 },
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

const Curve: React.FC<{ theme?: "dark" | "light" }> = ({ theme = "dark" }) => {
  const [windowHeight, setWindowHeight] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${
    windowHeight / 2
  } 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${
    windowHeight / 2
  } 100 0`;

  const curve: Variants = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  const isDark = theme === "dark";
  const fillColor = isDark ? "#09090b" : "#ffffff";

  return (
    <svg
      className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full pointer-events-none"
      style={{ fill: fillColor }}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

export const CurvedNavbar: React.FC<iCurvedNavbarProps> = ({
  setIsActive,
  navItems,
  theme: propTheme,
  footer,
}) => {
  const { theme: contextTheme, toggleTheme } = useTheme();
  const theme = propTheme || contextTheme;
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-zinc-950 text-white" : "bg-white text-black";

  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`h-[100dvh] w-screen max-w-[420px] fixed right-0 top-0 z-50 ${bgClass} shadow-2xl flex flex-col justify-between`}
    >
      <div className="h-full pt-8 sm:pt-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-4 px-8 sm:px-12 md:px-16">
          {/* Top Menu Controls: Theme Toggle & Small Cross (X) Close Icon */}
          <div className="flex items-center justify-between w-full pb-2 pt-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className={`p-1.5 transition-colors cursor-pointer flex items-center justify-center ${
                isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsActive(false)}
              aria-label="Close menu"
              title="Close menu"
              className={`p-1.5 transition-colors cursor-pointer flex items-center justify-center ${
                isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <section className="bg-transparent mt-2">
            <div className="mx-auto w-full">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.heading}
                  {...item}
                  setIsActive={setIsActive}
                  index={index + 1}
                  theme={theme}
                />
              ))}
            </div>
          </section>
        </div>
        {footer || <CustomFooter theme={theme} />}
      </div>
      <Curve theme={theme} />
    </motion.div>
  );
};

export const CurvedMenu: React.FC<iHeaderProps> = ({
  navItems,
  footer,
  onNavigate,
  className = "",
}) => {
  const [isActive, setIsActive] = useState(false);
  const { theme } = useTheme();

  // Handle default or customized items connected to the app's routing
  const items: iNavItem[] =
    navItems ||
    [
      {
        heading: "Home",
        href: "#hero-top",
        onClick: () => {
          if (onNavigate) onNavigate("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        heading: "Work",
        href: "#our-work",
        onClick: () => {
          if (onNavigate) onNavigate("our-work");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        heading: "Services",
        href: "#services",
        onClick: () => {
          if (onNavigate) onNavigate("home");
          setTimeout(() => {
            const el = document.getElementById("services");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 60);
        },
      },
      {
        heading: "Chat",
        href: "#chat",
        onClick: () => {
          if (onNavigate) onNavigate("chat");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        heading: "Contact",
        href: "#contact",
        onClick: () => {
          if (onNavigate) onNavigate("contact");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    ];

  // Prevent background scroll when curved menu is open on mobile
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  const isDark = theme === "dark";
  const triggerBg = isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-black";
  const burgerLine = isDark ? "bg-white" : "bg-black";

  return (
    <div className={`relative ${className}`}>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsActive(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setIsActive(!isActive)}
        aria-label={isActive ? "Close menu" : "Open navigation menu"}
        className="fixed right-4 top-3.5 sm:top-4 z-50 p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center"
      >
        <div className="relative w-5 h-4 flex flex-col justify-between items-center pointer-events-none">
          <span
            className={`block h-0.5 w-5 ${burgerLine} rounded-full transition-transform duration-300 ease-in-out ${
              isActive ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 ${burgerLine} rounded-full transition-opacity duration-200 ${
              isActive ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-5 ${burgerLine} rounded-full transition-transform duration-300 ease-in-out ${
              isActive ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </div>
      </button>

      {/* Animated Curved Drawer */}
      <AnimatePresence mode="wait">
        {isActive && (
          <CurvedNavbar
            setIsActive={setIsActive}
            navItems={items}
            theme={theme}
            footer={footer || <CustomFooter theme={theme} />}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurvedMenu;
