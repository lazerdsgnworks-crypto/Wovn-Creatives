import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { IMAGES } from "@/components/ui/demo";
import { Header } from "@/components/ui/header";
import { ZoomSlider } from "@/components/ui/zoom-slider";
import { KineticTeamHybrid } from "@/components/ui/kinetic-team-hybrid";
import { ServicesSection } from "@/components/ui/services-section";
import { HowItWorksSection } from "@/components/ui/how-it-works";
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { OurWorkPage } from "@/components/ui/our-work-page";
import { ContactPage } from "@/components/ui/contact-page";
import { LegalPoliciesPage, LegalTab } from "@/components/ui/legal-policies-page";
import Footer16, { AppPage } from "@/components/ui/footer-16";
import { AdminPortal } from "@/components/admin/admin-portal";
import { WovnChatbot } from "@/components/ui/wovn-chatbot";
import { useWebsiteData } from "@/context/website-data-context";
import { useTheme } from "@/context/theme-context";

const getInitialPage = (): AppPage => {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  const hash = window.location.hash.toLowerCase();
  const search = new URLSearchParams(window.location.search.toLowerCase());

  if (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    hash === "#admin" ||
    hash === "#/admin" ||
    search.get("page") === "admin" ||
    search.has("admin")
  ) {
    return "admin";
  }
  if (path === "/our-work" || hash === "#our-work" || hash === "#/our-work" || search.get("page") === "our-work") return "our-work";
  if (path === "/contact" || hash === "#contact" || hash === "#/contact" || search.get("page") === "contact") return "contact";
  if (path === "/privacy" || hash === "#privacy" || hash === "#/privacy" || search.get("page") === "privacy") return "privacy";
  if (path === "/terms" || hash === "#terms" || hash === "#/terms" || search.get("page") === "terms") return "terms";
  if (path === "/payments" || hash === "#payments" || hash === "#/payments" || search.get("page") === "payments") return "payments";
  if (path === "/faqs" || hash === "#faqs" || hash === "#/faqs" || search.get("page") === "faqs") return "faqs";
  return "home";
};

export default function App() {
  const { theme } = useTheme();
  const { data } = useWebsiteData();
  const [currentPage, setCurrentPage] = React.useState<AppPage>(getInitialPage);

  // Sync with browser navigation & URL changes
  React.useEffect(() => {
    const handleUrlChange = () => {
      setCurrentPage(getInitialPage());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Ctrl+Shift+A or Cmd+Shift+A to jump to /admin
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        navigateTo("admin");
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      if (page === "admin") {
        window.history.pushState(null, "", "/admin");
      } else if (page === "home") {
        window.history.pushState(null, "", "/");
      } else {
        window.history.pushState(null, "", `#${page}`);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Convert dynamic projects to ZoomSlider format
  const sliderItems = React.useMemo(() => {
    if (!data?.projects || data.projects.length === 0) return undefined;
    return data.projects.map((p, idx) => ({
      number: p.number || String(idx + 1).padStart(2, "0"),
      src: p.image,
      title: p.title.toUpperCase(),
      desc: p.desc,
    }));
  }, [data?.projects]);

  const calUrl = data?.settings?.calLink
    ? `https://cal.com/${data.settings.calLink}`
    : "https://cal.com/wovn-creatives/w";

  const rawPhone = data?.settings?.phone || "+92 300 1234567";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone || "923001234567"}?text=${encodeURIComponent(
    "Hi Wovn Creatives! I'd like to discuss a project."
  )}`;

  // If on admin route, render full-screen Admin Portal
  if (currentPage === "admin") {
    return <AdminPortal onBackToSite={() => navigateTo("home")} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans tracking-[-0.02em] selection:bg-zinc-300 dark:selection:bg-zinc-700 selection:text-zinc-950 dark:selection:text-white transition-colors duration-200">
      {/* Top Floating & Fixed Navigation Bar (Header only shows Home, Work, Services, Contact) */}
      <Header
        currentPage={currentPage === "our-work" ? "our-work" : currentPage === "contact" ? "contact" : "home"}
        onNavigate={(p) => navigateTo(p)}
      />

      {/* Page Routing */}
      {currentPage === "our-work" && (
        <OurWorkPage
          onNavigateHome={() => navigateTo("home")}
          calLink={data?.settings?.calLink || "wovn-creatives/w"}
        />
      )}

      {currentPage === "contact" && (
        <ContactPage
          onNavigateHome={() => navigateTo("home")}
          calLink={data?.settings?.calLink || "wovn-creatives/w"}
        />
      )}

      {(currentPage === "privacy" || currentPage === "terms" || currentPage === "payments" || currentPage === "faqs") && (
        <LegalPoliciesPage
          initialTab={
            currentPage === "privacy"
              ? "privacy"
              : currentPage === "terms"
              ? "terms"
              : currentPage === "payments"
              ? "payments"
              : "faqs"
          }
          onBack={() => navigateTo("home")}
          onContact={() => navigateTo("contact")}
        />
      )}

      {currentPage === "home" && (
        <main>
          {/* Hero Section containing the Image Corridor Animation */}
          <section
            id="hero-top"
            className="relative h-[84vh] sm:h-[88vh] md:h-screen w-full flex flex-col justify-between overflow-hidden bg-background pt-14 sm:pt-16"
          >
            <ImageStreamHero
              images={IMAGES}
              cards={8}
              mobileCards={7}
              speed={data?.settings?.heroSpeed || 22}
              axis={60}
              mobileAxis={59}
              className="h-full w-full border-none"
            >
              {/* Hero text: positioned slightly lower from top with safe clearance from background corridor */}
              <div className="pointer-events-none relative z-20 flex w-full flex-col items-center pt-5 sm:pt-7 md:pt-9 text-center">
                <div className="px-4 sm:px-6 flex flex-col items-center">
                  <h1 className="text-balance text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal tracking-[-0.01em] text-zinc-700 dark:text-zinc-200 leading-[0.98] sm:leading-[0.98] md:leading-[0.98]">
                    {data?.settings?.heroHeadingLine1 || "Generic?"}
                    <br />
                    <span className="font-normal text-zinc-950 dark:text-zinc-100">
                      {data?.settings?.heroHeadingLine2 || "Maybe try us."}
                    </span>
                  </h1>

                  {/* Buttons and Subtext matching the reference */}
                  <div className="pointer-events-auto mt-3 sm:mt-3.5 flex flex-col items-center">
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                      {/* Book a call with us button */}
                      <a
                        href={`https://cal.com/${data?.settings?.calLink || "wovn-creatives/w"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 pl-4 sm:pl-4.5 pr-1.5 py-1 rounded-full bg-black text-white border border-black dark:border-zinc-800 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                      >
                        <span className="text-xs sm:text-[13px] font-medium tracking-tight text-white whitespace-nowrap">
                          Book a call with us
                        </span>
                        <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#c8f0fe] flex items-center justify-center text-black shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4] text-black" />
                        </div>
                      </a>

                      {/* Send Message button */}
                      <a
                        href={`https://wa.me/${(data?.settings?.phone || "+923001234567").replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Wovn Creatives! I'd like to discuss a project.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 pl-2.5 pr-4 py-1.5 rounded-full bg-white text-zinc-900 border border-zinc-200/90 shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_-2px_rgba(0,0,0,0.12)] hover:bg-zinc-50/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                      >
                        <span className="w-5 h-5 sm:w-5.5 sm:h-5.5 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <path
                              fill="#25D366"
                              d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2Z"
                            />
                            <path
                              fill="#ffffff"
                              d="M17.52 14.36C17.22 14.21 15.76 13.49 15.49 13.39C15.22 13.29 15.02 13.24 14.82 13.54C14.62 13.84 14.05 14.51 13.87 14.71C13.7 14.91 13.52 14.94 13.22 14.79C12.92 14.64 11.96 14.32 10.82 13.3C9.93 12.51 9.33 11.53 9.16 11.23C8.98 10.93 9.14 10.77 9.29 10.62C9.42 10.49 9.58 10.27 9.73 10.1C9.88 9.92 9.93 9.8 10.03 9.6C10.13 9.4 10.08 9.22 10.01 9.07C9.93 8.92 9.34 7.45 9.09 6.85C8.85 6.27 8.6 6.35 8.42 6.34L7.85 6.33C7.65 6.33 7.32 6.4 7.05 6.7C6.78 7 6 7.73 6 9.21C6 10.69 7.08 12.12 7.23 12.32C7.38 12.52 9.35 15.56 12.37 16.86C13.09 17.17 13.65 17.36 14.08 17.5C14.8 17.73 15.46 17.7 15.98 17.62C16.56 17.53 17.76 16.89 18.01 16.19C18.26 15.49 18.26 14.89 18.18 14.77C18.11 14.64 17.82 14.51 17.52 14.36Z"
                            />
                          </svg>
                        </span>
                        <span className="text-xs sm:text-[13px] font-medium tracking-tight text-zinc-900 whitespace-nowrap">
                          Send Message
                        </span>
                      </a>
                    </div>

                    {/* Subtext below buttons */}
                    <p className="mt-2 sm:mt-2.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-normal tracking-tight">
                      No fluff. Just high-performance shipping.
                    </p>
                  </div>
                </div>
              </div>
            </ImageStreamHero>
          </section>

          {/* Zoom Slider section below the hero section with increased container height */}
          <ZoomSlider
            id="our-work"
            title="Our Work"
            scaleOnHover
            textOnHover
            size={1}
            easeScrollPercentage={100}
            sliderData={sliderItems}
          />

          {/* Kinetic Team section above Services */}
          <KineticTeamHybrid />

          {/* Services Section below the team section */}
          <ServicesSection />

          {/* How It Works / Process Section */}
          <HowItWorksSection
            id="how-it-works"
            calLink={data?.settings?.calLink || "wovn-creatives/w"}
          />

          {/* Meeting / Let's Talk Section just above the footer */}
          <LetsWorkTogether
            id="contact"
            calLink={data?.settings?.calLink || "wovn-creatives/w"}
          />
        </main>
      )}

      {/* Studio Footer */}
      {currentPage !== "our-work" && <Footer16 onNavigate={navigateTo} />}

      {/* Floating Gemini-Powered Wovn AI Chatbot */}
      <WovnChatbot />
    </div>
  );
}
