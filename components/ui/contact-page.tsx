import * as React from "react";
import { useTheme } from "@/context/theme-context";
import { useWebsiteData } from "@/context/website-data-context";

declare global {
  interface Window {
    Cal?: any;
  }
}

interface ContactPageProps {
  onNavigateHome?: () => void;
  calLink?: string;
}

export function ContactPage({
  calLink = "wovn-creatives/w",
}: ContactPageProps) {
  const { theme } = useTheme();
  const { data } = useWebsiteData();
  const settings = data?.settings;
  const effectiveCalLink = settings?.calLink || calLink;
  const contactEmail = settings?.contactEmail || "wovn.hq@gmail.com";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/dirbyraheem_?stkn=bGRtZ2R6cXc0NXpk";
  const linkedinUrl = settings?.linkedinUrl || "https://www.linkedin.com/in/umar-arif-92349537a/";
  const xUrl = settings?.xUrl || "https://x.com";

  React.useEffect(() => {
    // Cal embed loader snippet
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const s = d.createElement("script");
            s.src = A;
            s.async = true;
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    if (window.Cal) {
      window.Cal("init", "w", { origin: "https://app.cal.com" });
      window.Cal.config = window.Cal.config || {};
      window.Cal.config.forwardQueryParams = true;

      // Clear container before mount to avoid duplicate iframes on theme switch
      const container = document.getElementById("my-cal-inline-w");
      if (container) {
        container.innerHTML = "";
      }

      if (window.Cal.ns && window.Cal.ns.w) {
        window.Cal.ns.w("inline", {
          elementOrSelector: "#my-cal-inline-w",
          config: {
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            theme: theme === "light" ? "light" : "dark",
          },
          calLink: calLink,
        });

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
        });
      }
    }
  }, [theme, effectiveCalLink]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground pt-28 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-12 font-sans tracking-[-0.02em] transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="pb-10 sm:pb-14">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] font-medium tracking-[-0.04em] text-zinc-950 dark:text-white leading-[0.88] sm:leading-[0.85]">
            Contact Us
          </h1>
        </div>

        {/* Content Layout: Calendar & Contact Info */}
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Calendar Embed Column (order-1 on mobile, order-2 on desktop) */}
          <div className="w-full flex-1 order-1 lg:order-2 min-h-[620px] sm:min-h-[700px] h-[720px]">
            <div
              id="my-cal-inline-w"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
            />
          </div>

          {/* Contact Details Column */}
          <div className="w-full lg:w-72 shrink-0 order-2 lg:order-1 flex flex-row lg:flex-col justify-between items-start gap-6 lg:gap-10 pt-8 lg:pt-0 border-t lg:border-t-0 border-zinc-200/80 dark:border-zinc-800/80">
            {/* Email Block */}
            <div className="flex-1 lg:flex-initial pr-2 sm:pr-0">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-2">
                Email
              </span>
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm sm:text-base lg:text-lg font-normal text-zinc-950 dark:text-white hover:opacity-70 transition-opacity break-all"
              >
                {contactEmail}
              </a>
            </div>

            {/* Socials Block */}
            <div className="shrink-0 text-left">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-3">
                Socials
              </span>
              <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-lg font-normal text-zinc-950 dark:text-white">
                <a
                  href={xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Twitter / X
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
