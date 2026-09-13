import * as React from "react";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { IMAGES } from "@/components/ui/demo";
import { Header } from "@/components/ui/header";
import { ZoomSlider } from "@/components/ui/zoom-slider";
import { KineticTeamHybrid } from "@/components/ui/kinetic-team-hybrid";
import { ServicesSection } from "@/components/ui/services-section";
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { OurWorkPage } from "@/components/ui/our-work-page";
import { ContactPage } from "@/components/ui/contact-page";
import { LegalPoliciesPage, LegalTab } from "@/components/ui/legal-policies-page";
import Footer16, { AppPage } from "@/components/ui/footer-16";
import { AdminPortal } from "@/components/admin/admin-portal";
import { useWebsiteData } from "@/context/website-data-context";
import { useTheme } from "@/context/theme-context";

const getInitialPage = (): AppPage => {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path === "/admin" || path.startsWith("/admin/") || hash === "#admin" || hash === "#/admin") {
    return "admin";
  }
  if (path === "/our-work" || hash === "#our-work") return "our-work";
  if (path === "/contact" || hash === "#contact") return "contact";
  if (path === "/privacy" || hash === "#privacy") return "privacy";
  if (path === "/terms" || hash === "#terms") return "terms";
  if (path === "/payments" || hash === "#payments") return "payments";
  if (path === "/faqs" || hash === "#faqs") return "faqs";
  return "home";
};

export default function App() {
  const { theme } = useTheme();
  const { data } = useWebsiteData();
  const [currentPage, setCurrentPage] = React.useState<AppPage>(getInitialPage);

  // Sync with browser navigation & URL changes
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Ctrl+Shift+A or Cmd+Shift+A to jump to /admin
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        navigateTo("admin");
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handlePopState);
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
            className="relative h-[84vh] sm:h-[88vh] md:h-screen w-full flex flex-col justify-between overflow-hidden bg-background pt-16 sm:pt-20"
          >
            <ImageStreamHero
              images={IMAGES}
              cards={8}
              mobileCards={7}
              speed={data?.settings?.heroSpeed || 22}
              axis={50}
              mobileAxis={50}
              className="h-full w-full border-none"
            >
              {/* Hero text: positioned slightly above the middle corridor animation */}
              <div className="pointer-events-none relative z-20 flex w-full flex-col items-center pt-8 sm:pt-12 md:pt-16 text-center">
                <div className="px-4 sm:px-6">
                  <h1 className="text-balance text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal tracking-[-0.01em] text-zinc-700 dark:text-zinc-200 leading-[0.98] sm:leading-[0.98] md:leading-[0.98]">
                    {data?.settings?.heroHeadingLine1 || "Generic?"}
                    <br />
                    <span className="font-normal text-zinc-950 dark:text-zinc-100">
                      {data?.settings?.heroHeadingLine2 || "Maybe try us."}
                    </span>
                  </h1>
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

          {/* Meeting / Let's Talk Section just above the footer */}
          <LetsWorkTogether
            id="contact"
            calLink={data?.settings?.calLink || "wovn-creatives/w"}
          />
        </main>
      )}

      {/* Studio Footer */}
      {currentPage !== "our-work" && <Footer16 onNavigate={navigateTo} />}
    </div>
  );
}
