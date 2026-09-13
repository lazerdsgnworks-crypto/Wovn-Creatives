'use client';

import React from 'react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import { useTheme } from '@/context/theme-context';
import { useWebsiteData } from '@/context/website-data-context';

interface ServiceCardData {
  number: string;
  badge: string;
  titleLines: string[];
  tagline: string;
  deliverables: {
    title: string;
    description?: string;
  }[];
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    number: '01 - UI/UX Design (Framer)',
    badge: 'Design & Build',
    titleLines: ['UI/UX', 'DESIGN'],
    tagline: 'Crafting intuitive, high-converting digital experiences, designed and built in Framer.',
    deliverables: [
      { title: 'Wireframes & prototypes', description: 'Interactive user flows, testing layouts, and structured wireframes.' },
      { title: 'High-fidelity UI design', description: 'Pixel-perfect component systems, typography, and visual assets.' },
      { title: 'Responsive Framer website', description: 'Fluid breakpoints, bespoke interactions, and zero-code publishing.' },
      { title: 'Style guide & handoff', description: 'Reusable design tokens, color styles, and component documentation.' },
    ],
  },
  {
    number: '02 - Branding',
    badge: 'Visual Identity',
    titleLines: ['Brand', 'Identity', 'Systems'],
    tagline: 'Building a memorable brand identity that stands out and stays consistent everywhere.',
    deliverables: [
      { title: 'Logo & visual identity', description: 'Primary marks, secondary badges, monograms, and vector assets.' },
      { title: 'Color palette & typography', description: 'Curated color systems, accessible contrast, and font hierarchy.' },
      { title: 'Brand guidelines', description: 'Comprehensive rulebook on clearspace, sizing, and usage standards.' },
      { title: 'Social media kit', description: 'Ready-to-use profile kits, post templates, and header collateral.' },
    ],
  },
  {
    number: '03 - Social Media Management',
    badge: 'Growth & Reach',
    titleLines: ['Social', 'Media', 'Strategy'],
    tagline: 'Growing your online presence with strategic content, consistent posting, and real engagement.',
    deliverables: [
      { title: 'Content calendar', description: 'Monthly strategic roadmap aligned with product releases and trends.' },
      { title: 'Custom graphics & captions', description: 'On-brand motion clips, carousels, and high-converting copy.' },
      { title: 'Scheduling & publishing', description: 'Optimal posting times, cross-channel synchronization, and tags.' },
      { title: 'Monthly analytics report', description: 'KPI audits, audience retention metrics, and actionable growth insights.' },
    ],
  },
  {
    number: '04 - Web Development',
    badge: 'Engineering',
    titleLines: ['Web', 'Development', '& Code'],
    tagline: 'Turning designs into fast, functional, and scalable websites.',
    deliverables: [
      { title: 'Frontend & backend development', description: 'High-performance React/Next architecture and clean APIs.' },
      { title: 'CMS integration', description: 'Empower your team with intuitive headless content management.' },
      { title: 'SEO-friendly structure', description: 'Semantic markup, metadata, OpenGraph cards, and fast Lighthouse scores.' },
      { title: 'Testing & launch', description: 'Cross-browser validation, domain setup, SSL, and zero-downtime deployment.' },
    ],
  },
  {
    number: '05 - AI Automations',
    badge: 'Smart Workflows',
    titleLines: ['AI', 'Automations', '& Agents'],
    tagline: 'Automating repetitive tasks and connecting your tools with smart AI workflows.',
    deliverables: [
      { title: 'Workflow mapping', description: 'Bottleneck auditing and mapping multi-step automations.' },
      { title: 'Zapier/Make/n8n setup', description: 'Robust integrations connecting CRM, email, Slack, and databases.' },
      { title: 'AI chatbot integration', description: 'Custom knowledge base agents for 24/7 client support and triage.' },
      { title: 'SOP & training handover', description: 'Step-by-step documentation and Loom video walkthroughs for your team.' },
    ],
  },
];

export function ServicesSection() {
  const { theme } = useTheme();
  const { data } = useWebsiteData();
  const isDark = theme === 'dark';
  const servicesList = data?.services && data.services.length > 0 ? data.services : SERVICES_DATA;

  return (
    <div id="services" className="w-full bg-white dark:bg-[#070709] relative transition-colors duration-500">
      <FlowArt aria-label="WOVN Studio Services">
        {servicesList.map((service, index) => {
          // Alternating black and white according to theme
          const isCardDark = isDark ? index % 2 === 0 : index % 2 !== 0;
          const bgStyle = isCardDark ? '#09090b' : '#ffffff';
          const textStyle = isCardDark ? '#ffffff' : '#09090b';
          const subtextClass = isCardDark ? 'text-zinc-300' : 'text-zinc-700';
          const itemTitleClass = isCardDark ? 'text-white' : 'text-zinc-950';
          const itemDescClass = isCardDark ? 'text-zinc-400' : 'text-zinc-600';
          const numberLabelClass = isCardDark ? 'text-zinc-400' : 'text-zinc-500';

          return (
            <FlowSection
              key={service.number}
              aria-label={service.number}
              style={{ backgroundColor: bgStyle, color: textStyle }}
            >
              {/* Card Header Top Row */}
              <div className="flex items-center justify-between gap-4">
                <p className={`text-xs sm:text-sm font-normal uppercase tracking-[0.2em] ${numberLabelClass}`}>
                  {service.number.replace(/—/g, '-').replace(/–/g, '-')}
                </p>
                <span className={`text-xs font-mono uppercase tracking-widest ${numberLabelClass}`}>
                  {service.badge}
                </span>
              </div>

              <div className="my-2 sm:my-3 md:my-[1.2vw]" />

              {/* Huge Headline without bold */}
              <div>
                <h2 className="text-[clamp(2.6rem,8.5vw,10.5rem)] font-normal leading-[0.9] uppercase tracking-tight">
                  {service.titleLines.map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {line}
                      {lIdx < service.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
              </div>

              <div className="my-2 sm:my-3 md:my-[1.2vw]" />

              {/* Tagline without em dashes */}
              <p className={`max-w-[58ch] text-[clamp(1rem,2vw,1.75rem)] font-normal leading-relaxed ${subtextClass}`}>
                {service.tagline.replace(/—/g, ', ').replace(/–/g, '-')}
              </p>

              <div className="my-2 sm:my-3 md:my-[1.2vw]" />

              {/* 4 Deliverables / Items (Clean, Borderless, Background-Free) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-2">
                {service.deliverables.map((item, dIdx) => (
                  <div
                    key={item.title}
                    className="p-0 transition-all duration-300 bg-transparent border-0"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-mono uppercase font-normal ${numberLabelClass}`}>
                        0{dIdx + 1}
                      </span>
                    </div>
                    <p className={`text-sm sm:text-base font-normal mb-1.5 leading-snug ${itemTitleClass}`}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className={`text-xs sm:text-[13px] font-normal leading-relaxed ${itemDescClass}`}>
                        {item.description.replace(/—/g, ', ').replace(/–/g, '-')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Pagination Bar */}
              <div className="mt-auto pt-6 flex items-center justify-end text-[11px] font-mono uppercase tracking-widest opacity-60">
                <span>0{index + 1} / 05</span>
              </div>
            </FlowSection>
          );
        })}
      </FlowArt>
    </div>
  );
}

export default ServicesSection;
