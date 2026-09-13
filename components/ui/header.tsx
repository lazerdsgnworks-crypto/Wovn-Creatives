import * as React from "react";
import { Sun, Moon, User, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "motion/react";
import { CurvedNavbar, iNavItem } from "@/components/ui/curved-menu";

interface NavItem {
  id: string;
  label: string;
  targetId: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", targetId: "hero-top" },
  { id: "our-work", label: "Work", targetId: "our-work" },
  { id: "chat", label: "Chat", targetId: "chat" },
  { id: "services", label: "Services", targetId: "services" },
  { id: "contact", label: "Contact", targetId: "contact" },
];

interface HeaderProps {
  currentPage?: "home" | "our-work" | "chat" | "contact";
  onNavigate?: (page: "home" | "our-work" | "chat" | "contact") => void;
}

export function Header({ currentPage = "home", onNavigate }: HeaderProps = {}) {
  const [activeSection, setActiveSection] = React.useState<string>("home");
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal, logout } = useAuth();
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorRect, setIndicatorRect] = React.useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({ left: 0, top: 0, width: 0, height: 0, ready: false });

  const currentHighlight =
    hoveredSection ?? (currentPage === "home" ? activeSection : currentPage);

  React.useEffect(() => {
    if (currentPage !== "home") {
      setActiveSection(currentPage);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= docHeight - 140) {
        setActiveSection("contact");
        return;
      }

      const contactEl = document.getElementById("contact");
      const howItWorksEl = document.getElementById("how-it-works");
      const servicesEl = document.getElementById("services");
      const ourWorkEl = document.getElementById("our-work");

      if (contactEl && scrollY >= contactEl.offsetTop - 300) {
        setActiveSection("contact");
      } else if (howItWorksEl && scrollY >= howItWorksEl.offsetTop - 260) {
        setActiveSection("process");
      } else if (servicesEl && scrollY >= servicesEl.offsetTop - 260) {
        setActiveSection("services");
      } else if (ourWorkEl && scrollY >= ourWorkEl.offsetTop - 260) {
        setActiveSection("our-work");
      } else {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  // Update the sliding border indicator position smoothly whenever currentHighlight changes
  React.useEffect(() => {
    const updateIndicator = () => {
      const target = itemRefs.current.get(currentHighlight);
      const container = navRef.current;
      if (target && container) {
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setIndicatorRect({
          left: targetRect.left - containerRect.left,
          top: targetRect.top - containerRect.top,
          width: targetRect.width,
          height: targetRect.height,
          ready: true,
        });
      }
    };

    // Immediate calculation and requestAnimationFrame to handle any layout shifts
    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [currentHighlight]);

  const handleNavClick = (itemId: string, targetId: string) => {
    if (itemId === "chat") {
      if (onNavigate) {
        onNavigate("chat");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (itemId === "our-work") {
      if (onNavigate) {
        onNavigate("our-work");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (itemId === "contact") {
      if (onNavigate) {
        onNavigate("contact");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (itemId === "home") {
      if (onNavigate) {
        onNavigate("home");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (itemId === "services") {
      if (currentPage !== "home" && onNavigate) {
        onNavigate("home");
        setTimeout(() => {
          const element = document.getElementById("services");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 80);
        return;
      }
      const element = document.getElementById("services");
      if (element) element.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (currentPage !== "home" && onNavigate) {
      onNavigate("home");
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Bar: Logo remains firmly pinned at top left of document flow. Positioned absolutely so it does not stick during page scroll. */}
      <header className="absolute top-0 left-0 right-0 z-40 py-4 sm:py-5 pointer-events-none transition-all duration-300 font-sans tracking-[-0.02em]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Studio Brand Logo: WOVN STUDIO GRID */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate("home");
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pointer-events-auto flex items-center transition-opacity hover:opacity-85 focus:outline-none cursor-pointer"
              id="brand-logo-link"
              aria-label="Home"
            >
              <div className="relative h-9 sm:h-11 w-20 sm:w-24 flex items-center">
                <img
                  src="https://i.ibb.co/Mxwyd6vs/WOVN-STUDIO-GRID-3.png"
                  alt="WOVN STUDIO GRID (3)"
                  className={`absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500 ease-in-out ${
                    currentPage === "our-work" || theme === "dark"
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  loading="eager"
                />
                <img
                  src="https://i.ibb.co/fGKVkSqJ/WOVN-STUDIO-GRID-2.png"
                  alt="WOVN STUDIO GRID (2)"
                  className={`absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500 ease-in-out ${
                    currentPage !== "our-work" && theme === "light"
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  loading="eager"
                />
              </div>
            </a>

            {/* Top Right Controls (Theme Toggle, Login/Signup User Icon & Menu Button) */}
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
              {/* Login / User Account Icon: ONLY on first page (home) and ONLY the icon */}
              {(currentPage === "home" || !currentPage) && (
                <div className="relative" ref={userMenuRef}>
                  {user ? (
                    <button
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                      className="relative w-9 h-9 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center rounded-full group"
                      aria-label="User account menu"
                      title={user.email || user.displayName || "Account"}
                      id="header-user-menu-btn"
                    >
                      <div className="relative flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform" />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuthModal("login")}
                      className="relative w-9 h-9 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center rounded-full group"
                      aria-label="Login or Sign Up"
                      title="Sign in / Create Account"
                      id="header-login-signup-btn"
                    >
                      <User className="h-4 w-4 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform" />
                    </button>
                  )}

                  {/* User Dropdown Menu */}
                  {user && isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50 text-xs text-zinc-800 dark:text-zinc-200 animate-fadeIn">
                      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-900 mb-1">
                        <p className="font-semibold text-zinc-950 dark:text-white truncate">
                          {user.displayName || "Logged In User"}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle Button */}
              {currentPage !== "our-work" && (
                <button
                  onClick={toggleTheme}
                  className="relative w-9 h-9 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center rounded-full"
                  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  id="header-theme-toggle-btn"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center justify-center"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4 text-zinc-100" />
                      ) : (
                        <Moon className="h-4 w-4 text-zinc-900" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              )}

              {/* Navigation Drawer Trigger: visible on mobile, and always on work page in white */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`relative w-9 h-9 cursor-pointer flex items-center justify-center rounded-full transition-colors group ${
                  currentPage === "our-work"
                    ? "flex text-white hover:text-white/80 hover:bg-white/10"
                    : "flex md:hidden text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
                title={isMobileMenuOpen ? "Close menu" : "Menu"}
                id="header-mobile-menu-btn"
              >
                <div className="relative w-4 h-3 flex flex-col justify-between items-center pointer-events-none">
                  <span
                    className={`block h-0.5 w-4 rounded-full transition-transform duration-300 ${
                      currentPage === "our-work"
                        ? "bg-white"
                        : "bg-zinc-800 dark:bg-zinc-200"
                    } ${isMobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""}`}
                  />
                  <span
                    className={`block h-0.5 w-4 rounded-full transition-opacity duration-200 ${
                      currentPage === "our-work"
                        ? "bg-white"
                        : "bg-zinc-800 dark:bg-zinc-200"
                    } ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                  />
                  <span
                    className={`block h-0.5 w-4 rounded-full transition-transform duration-300 ${
                      currentPage === "our-work"
                        ? "bg-white"
                        : "bg-zinc-800 dark:bg-zinc-200"
                    } ${isMobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Animated Curved Drawer Menu */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <div className={currentPage === "our-work" ? "block" : "md:hidden"}>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />
            <CurvedNavbar
              setIsActive={setIsMobileMenuOpen}
              navItems={[
                {
                  heading: "Home",
                  href: "#hero-top",
                  onClick: () => handleNavClick("home", "hero-top"),
                },
                {
                  heading: "Work",
                  href: "#our-work",
                  onClick: () => handleNavClick("our-work", "our-work"),
                },
                {
                  heading: "Services",
                  href: "#services",
                  onClick: () => handleNavClick("services", "services"),
                },
                {
                  heading: "Chat",
                  href: "#chat",
                  onClick: () => handleNavClick("chat", "chat"),
                },
                {
                  heading: "Contact",
                  href: "#contact",
                  onClick: () => handleNavClick("contact", "contact"),
                },
              ]}
              theme={theme}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation Header */}
      <nav
        ref={navRef}
        aria-label="Main Navigation"
        onMouseLeave={() => setHoveredSection(null)}
        className="hidden md:flex fixed bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 z-50 items-center gap-1 sm:gap-1.5 p-1.5 rounded-full border-0 border-none bg-white/15 dark:bg-white/[0.04] backdrop-blur-md backdrop-saturate-[180%] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.7)] select-none"
      >
        {/* Single continuous morphing border: glides smoothly across items without breaking */}
        {indicatorRect.ready && (
          <motion.div
            className={`pointer-events-none absolute rounded-full border bg-transparent z-10 ${
              currentPage === "our-work"
                ? "border-white"
                : "border-black dark:border-white"
            }`}
            initial={false}
            animate={{
              left: indicatorRect.left,
              top: indicatorRect.top,
              width: indicatorRect.width,
              height: indicatorRect.height,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 32,
              mass: 0.85,
            }}
          />
        )}

        {NAV_ITEMS.map((item) => {
          const isSelected = currentHighlight === item.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current.set(item.id, el);
                } else {
                  itemRefs.current.delete(item.id);
                }
              }}
              onClick={() => handleNavClick(item.id, item.targetId)}
              onMouseEnter={() => setHoveredSection(item.id)}
              className={`relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-[-0.02em] whitespace-nowrap transition-colors duration-300 bg-transparent border-0 outline-none cursor-pointer ${
                currentPage === "our-work"
                  ? isSelected
                    ? "text-white"
                    : "text-zinc-300 hover:text-white"
                  : isSelected
                  ? "text-zinc-950 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
              id={`floating-nav-${item.id}`}
            >
              <span className="relative z-20">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Header;

