import React, { createContext, useContext, useEffect, useState } from "react";
import {
  WebsiteData,
  SiteSettings,
  TeamMember,
  WorkProject,
  ServiceItem,
  FaqItem,
  Inquiry,
} from "@/types";

const STORAGE_KEY = "wovn_website_data_v1";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  agencyName: "WOVN CREATIVES",
  heroHeadingLine1: "Generic?",
  heroHeadingLine2: "Maybe try us.",
  calLink: "wovn-creatives/w",
  contactEmail: "wovn.hq@gmail.com",
  phone: "+92 300 1234567",
  location: "Lahore, Pakistan",
  instagramUrl: "https://www.instagram.com/dirbyraheem_?stkn=bGRtZ2R6cXc0NXpk",
  linkedinUrl: "https://www.linkedin.com/in/umar-arif-92349537a/",
  xUrl: "https://x.com",
  heroSpeed: 22,
  heroCards: 8,
};

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-01",
    number: "01",
    name: "Umar Arif",
    role: "Founder",
    image: "https://i.ibb.co/HfZbHm5k/4c5e4fd1-526f-421e-a503-b5cd69d2a6fb.jpg",
    link: "https://www.linkedin.com/in/umar-arif-92349537a/",
  },
  {
    id: "team-02",
    number: "02",
    name: "Uzair Arif",
    role: "Co-Founder",
    image: "https://i.ibb.co/0RZNjwx9/FD5-C8372-961-E-4234-AFEE-D9-FF4-D3-AEA40.png",
    link: "https://www.linkedin.com/in/uzair-arif-221637423/",
  },
  {
    id: "team-03",
    number: "03",
    name: "Abdul Raheem",
    role: "Senior Designer",
    image: "https://cdn.21st.dev/assets/mirror/f7/f71c8ba6dcdbbd92b51148e24580d086bbb9ab8a7f3347fc85b8babadabf30b8.jpg",
    link: "https://www.instagram.com/dirbyraheem_?stkn=bGRtZ2R6cXc0NXpk",
  },
  {
    id: "team-04",
    number: "04",
    name: "Muhammad Saad",
    role: "UI/UX & Development",
    image: "https://cdn.21st.dev/assets/mirror/8e/8e261490a2d4c74252dcfe6dbc02f071e85e536db18802927b170d53c849efd3.jpg",
    link: "https://www.linkedin.com/in/hafizsaad-design?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    id: "team-05",
    number: "05",
    name: "Abdullah Shahid",
    role: "Full Stack Developer",
    image: "https://cdn.21st.dev/assets/mirror/68/68abbec2895adaa5ab70d66ad4a4a41494e210d76471ecb9a8c113acc3ff2e6e.jpg",
    link: "https://www.linkedin.com/in/abdullah-shahid-a61175336?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
];

export const DEFAULT_PROJECTS: WorkProject[] = [
  {
    id: "project-01",
    number: "01",
    title: "Aura Atmosphere",
    desc: "Soft light and iridescent atmospheric tones",
    image: "https://i.ibb.co/m5R73btf/hf-20260912-193317-f5868bff-6646-42b1-94d8-e4edcba52484.png",
    meta: ["2026", "3D & SPATIAL", "GLOBAL LAUNCH"],
    accent: "#7b61ff",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-02",
    number: "02",
    title: "Flora Architecture",
    desc: "Organic moss and botanical rock architecture",
    image: "https://i.ibb.co/QvYGTRsn/hf-20260912-194151-55ce9bd5-8fe5-40e7-b570-118cd200b1f6.png",
    meta: ["2026", "SPATIAL BOTANY", "PARIS"],
    accent: "#00c8ff",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-03",
    number: "03",
    title: "Form & Structure",
    desc: "Shapes and chrome axes carved by light",
    image: "https://i.ibb.co/Wp6dXt2Z/hf-20260912-193317-96734949-14ed-49e4-a089-8e920589b2b0.png",
    meta: ["2026", "CHROME KINETICS", "RED DOT '26"],
    accent: "#ff4114",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-04",
    number: "04",
    title: "Spatial Flow",
    desc: "Smooth transitions in spatial motion",
    image: "https://i.ibb.co/Z1bp74TR/hf-20260912-191155-5f71e124-8e87-42bc-8b86-1cff2150b5d0.png",
    meta: ["2025", "MOTION GRAPHICS", "+6.4M REACH"],
    accent: "#2f7bff",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-05",
    number: "05",
    title: "Dimensional Depth",
    desc: "Layers and visual weight in dimensional space",
    image: "https://i.ibb.co/KzfwqN8C/hf-20260912-191255-78bb3dd2-f71b-435f-9c64-55cd88dc29fe.png",
    meta: ["2025", "IMMERSIVE SPATIAL", "TOKYO"],
    accent: "#4356c8",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-06",
    number: "06",
    title: "Temporal Energy",
    desc: "Movement captured across temporal frames",
    image: "https://i.ibb.co/rRt0gSH8/hf-20260912-191457-5b20f26b-8f37-401e-862a-e1ef62e02a63.png",
    meta: ["2025", "GENERATIVE 3D", "BERLIN"],
    accent: "#ff2f9c",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-07",
    number: "07",
    title: "Digital Distortion",
    desc: "Breaking visual boundaries with digital distortion",
    image: "https://i.ibb.co/WNcJNZmd/hf-20260912-192806-549bed52-0312-4da7-9f03-204a384a215e.png",
    meta: ["2024", "EXPERIMENTAL CGI", "LONDON"],
    accent: "#e5231b",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-08",
    number: "08",
    title: "Spectral Horizon",
    desc: "Kinetic light refracts into pure prism spectra",
    image: "https://i.ibb.co/NdjnKbwy/hf-20260912-193056-2a68be59-2b90-4b50-b553-c64e14ce4419.png",
    meta: ["2024", "KINETIC OPTICS", "NEW YORK"],
    accent: "#ff8c00",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
  {
    id: "project-09",
    number: "09",
    title: "Cybernetic Pulse",
    desc: "Ultra-precise synchronized audio-reactive systems",
    image: "https://i.ibb.co/GfwPZrZC/hf-20260912-193857-676dccef-3441-445d-b269-8fcf6201c675.png",
    meta: ["2024", "REALTIME VISUALS", "SEOUL"],
    accent: "#00e5a3",
    credit: "WOVN CREATIVES",
    creditUrl: "https://www.instagram.com/wovncreatives",
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "srv-01",
    number: "01 — UI/UX Design (Framer)",
    badge: "Design & Build",
    titleLines: ["UI/UX", "DESIGN"],
    tagline: "Crafting intuitive, high-converting digital experiences — designed and built in Framer.",
    deliverables: [
      { title: "Wireframes & prototypes", description: "Interactive user flows, testing layouts, and structured wireframes." },
      { title: "High-fidelity UI design", description: "Pixel-perfect component systems, typography, and visual assets." },
      { title: "Responsive Framer website", description: "Fluid breakpoints, bespoke interactions, and zero-code publishing." },
      { title: "Style guide & handoff", description: "Reusable design tokens, color styles, and component documentation." },
    ],
  },
  {
    id: "srv-02",
    number: "02 — Branding",
    badge: "Visual Identity",
    titleLines: ["Brand", "Identity", "Systems"],
    tagline: "Building a memorable brand identity that stands out and stays consistent everywhere.",
    deliverables: [
      { title: "Logo & visual identity", description: "Primary marks, secondary badges, monograms, and vector assets." },
      { title: "Color palette & typography", description: "Curated color systems, accessible contrast, and font hierarchy." },
      { title: "Brand guidelines", description: "Comprehensive rulebook on clearspace, sizing, and usage standards." },
      { title: "Social media kit", description: "Ready-to-use profile kits, post templates, and header collateral." },
    ],
  },
  {
    id: "srv-03",
    number: "03 — Social Media Management",
    badge: "Growth & Reach",
    titleLines: ["Social", "Media", "Strategy"],
    tagline: "Growing your online presence with strategic content, consistent posting, and real engagement.",
    deliverables: [
      { title: "Content calendar", description: "Monthly strategic roadmap aligned with product releases and trends." },
      { title: "Custom graphics & captions", description: "On-brand motion clips, carousels, and high-converting copy." },
      { title: "Scheduling & publishing", description: "Optimal posting times, cross-channel synchronization, and tags." },
      { title: "Monthly analytics report", description: "KPI audits, audience retention metrics, and actionable growth insights." },
    ],
  },
  {
    id: "srv-04",
    number: "04 — Web Development",
    badge: "Engineering",
    titleLines: ["Web", "Development", "& Code"],
    tagline: "Turning designs into fast, functional, and scalable websites.",
    deliverables: [
      { title: "Frontend & backend development", description: "High-performance React/Next architecture and clean APIs." },
      { title: "CMS integration", description: "Empower your team with intuitive headless content management." },
      { title: "SEO-friendly structure", description: "Semantic markup, metadata, OpenGraph cards, and fast Lighthouse scores." },
      { title: "Testing & launch", description: "Cross-browser validation, domain setup, SSL, and zero-downtime deployment." },
    ],
  },
  {
    id: "srv-05",
    number: "05 — AI Automations",
    badge: "Smart Workflows",
    titleLines: ["AI", "Automations", "& Agents"],
    tagline: "Streamlining client operations and scaling speed with intelligent automations.",
    deliverables: [
      { title: "Workflow automation (Make/Zapier)", description: "Automated onboarding pipelines, CRM triggers, and client alerts." },
      { title: "Custom AI Agents", description: "Tailored reasoning workflows connected to your internal databases." },
      { title: "Chatbots & Assistants", description: "Conversational agents trained on your specific brand knowledge base." },
      { title: "Systems Integration", description: "Bridging Notion, Slack, Google Workspace, and proprietary APIs." },
    ],
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-01",
    q: "What services does Wovn Creatives offer?",
    a: "We offer UI/UX design (including Framer websites), branding, social media management, web development, and AI automation services.",
  },
  {
    id: "faq-02",
    q: "Where is Wovn Creatives based?",
    a: "We are based in Lahore, Pakistan, and work with clients both locally and internationally.",
  },
  {
    id: "faq-03",
    q: "How do I start a project with you?",
    a: "Reach out via our website, email, or social media to book a discovery call. We'll discuss your goals, share a proposal, and get started once the agreement and deposit are confirmed.",
  },
  {
    id: "faq-04",
    q: "How long does a typical project take?",
    a: "Timelines vary by service — a Framer website may take 2–4 weeks, branding 1–3 weeks, while social media management and AI automations are ongoing engagements. Exact timelines are shared in your proposal.",
  },
  {
    id: "faq-05",
    q: "Do you work with international clients?",
    a: "Yes. We work with clients worldwide and accept international payments through Payoneer, Wise, and bank transfers.",
  },
  {
    id: "faq-06",
    q: "What is your payment structure?",
    a: "Typically 50% upfront and 50% on completion for one-off projects, or monthly in advance for retainer-based services like social media management.",
  },
  {
    id: "faq-07",
    q: "Can I get a refund if I change my mind?",
    a: "Deposits are non-refundable once work begins. Please see our Payment & Refund Policy for full details.",
  },
  {
    id: "faq-08",
    q: "How many revisions are included?",
    a: "Most packages include 1–2 rounds of revisions. Additional revisions beyond the agreed scope are billed separately.",
  },
  {
    id: "faq-09",
    q: "Who owns the final designs/website/content?",
    a: "Once full payment is received, ownership of the final deliverables transfers to you. We may showcase the work in our portfolio unless you request otherwise.",
  },
  {
    id: "faq-10",
    q: "Do you offer website maintenance after launch?",
    a: "Yes, we offer optional monthly maintenance and support packages for websites and automations after launch.",
  },
  {
    id: "faq-11",
    q: "What platforms do you build websites on?",
    a: "Primarily Framer for fast, design-forward builds, along with custom development and other CMS platforms depending on project needs.",
  },
  {
    id: "faq-12",
    q: "Can you manage our social media accounts directly?",
    a: "Yes, we offer full social media management including content creation, scheduling, posting, and monthly performance reporting.",
  },
  {
    id: "faq-13",
    q: "What tools do you use for AI automation?",
    a: "We typically build automations using tools like Make, Zapier, n8n, and custom AI integrations depending on your existing tech stack.",
  },
  {
    id: "faq-14",
    q: "Is my business/project information kept confidential?",
    a: "Yes. All client information and project details are kept confidential and are only shared internally or with authorized subcontractors under confidentiality obligations.",
  },
  {
    id: "faq-15",
    q: "How can I contact Wovn Creatives?",
    a: "You can reach us via email at wovn.hq@gmail.com, our website contact form, or direct message on our social channels.",
  },
];

export const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq-01",
    name: "Alexander Wright",
    email: "alex@wrightatelier.com",
    company: "Wright Atelier Paris",
    service: "UI/UX & Branding",
    budget: "$8,000 - $15,000",
    message: "Looking for an ultra-clean Framer portfolio and luxury identity redesign for our fashion studio.",
    date: "2026-09-12T14:20:00Z",
    status: "new",
  },
  {
    id: "inq-02",
    name: "Sophie Chen",
    email: "sophie@lumina-ai.io",
    company: "Lumina AI Labs",
    service: "Web Development & AI Automations",
    budget: "$15,000 - $25,000",
    message: "We need an interactive web platform with automated lead qualification workflows and custom 3D visuals.",
    date: "2026-09-11T09:45:00Z",
    status: "in-review",
  },
];

const INITIAL_DATA: WebsiteData = {
  settings: DEFAULT_SITE_SETTINGS,
  team: DEFAULT_TEAM_MEMBERS,
  projects: DEFAULT_PROJECTS,
  services: DEFAULT_SERVICES,
  faqs: DEFAULT_FAQS,
  inquiries: DEFAULT_INQUIRIES,
};

interface WebsiteDataContextType {
  data: WebsiteData;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateTeamMember: (member: TeamMember) => void;
  addTeamMember: (member: Omit<TeamMember, "id">) => void;
  deleteTeamMember: (id: string) => void;
  reorderTeam: (team: TeamMember[]) => void;
  updateProject: (project: WorkProject) => void;
  addProject: (project: Omit<WorkProject, "id">) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: WorkProject[]) => void;
  updateService: (service: ServiceItem) => void;
  addService: (service: Omit<ServiceItem, "id">) => void;
  deleteService: (id: string) => void;
  updateFaq: (faq: FaqItem) => void;
  addFaq: (faq: Omit<FaqItem, "id">) => void;
  deleteFaq: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "date" | "status">) => void;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => void;
  deleteInquiry: (id: string) => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

export function WebsiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WebsiteData>(() => {
    if (typeof window === "undefined") return INITIAL_DATA;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          settings: { ...DEFAULT_SITE_SETTINGS, ...(parsed.settings || {}) },
          team: Array.isArray(parsed.team) && parsed.team.length > 0 ? parsed.team : DEFAULT_TEAM_MEMBERS,
          projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : DEFAULT_PROJECTS,
          services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : DEFAULT_SERVICES,
          faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_FAQS,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : DEFAULT_INQUIRIES,
        };
      }
    } catch (e) {
      console.warn("Failed to load saved website data from localStorage:", e);
    }
    return INITIAL_DATA;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to persist website data to localStorage:", e);
    }
  }, [data]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const updateTeamMember = (member: TeamMember) => {
    setData((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === member.id ? member : m)),
    }));
  };

  const addTeamMember = (member: Omit<TeamMember, "id">) => {
    const newId = `team-${Date.now()}`;
    const nextNumber = String(data.team.length + 1).padStart(2, "0");
    const newMember: TeamMember = {
      ...member,
      id: newId,
      number: member.number || nextNumber,
    };
    setData((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }));
  };

  const deleteTeamMember = (id: string) => {
    setData((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
    }));
  };

  const reorderTeam = (team: TeamMember[]) => {
    setData((prev) => ({ ...prev, team }));
  };

  const updateProject = (project: WorkProject) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  };

  const addProject = (project: Omit<WorkProject, "id">) => {
    const newId = `project-${Date.now()}`;
    const nextNumber = String(data.projects.length + 1).padStart(2, "0");
    const newProject: WorkProject = {
      ...project,
      id: newId,
      number: project.number || nextNumber,
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const reorderProjects = (projects: WorkProject[]) => {
    setData((prev) => ({ ...prev, projects }));
  };

  const updateService = (service: ServiceItem) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === service.id ? service : s)),
    }));
  };

  const addService = (service: Omit<ServiceItem, "id">) => {
    const newId = `srv-${Date.now()}`;
    const nextNumber = String(data.services.length + 1).padStart(2, "0");
    const newService: ServiceItem = {
      ...service,
      id: newId,
      number: service.number || `${nextNumber} — ${service.badge}`,
    };
    setData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const deleteService = (id: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  const updateFaq = (faq: FaqItem) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === faq.id ? faq : f)),
    }));
  };

  const addFaq = (faq: Omit<FaqItem, "id">) => {
    const newId = `faq-${Date.now()}`;
    const newFaq: FaqItem = { ...faq, id: newId };
    setData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));
  };

  const deleteFaq = (id: string) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
  };

  const addInquiry = (inquiry: Omit<Inquiry, "id" | "date" | "status">) => {
    const newId = `inq-${Date.now()}`;
    const newInquiry: Inquiry = {
      ...inquiry,
      id: newId,
      date: new Date().toISOString(),
      status: "new",
    };
    setData((prev) => ({
      ...prev,
      inquiries: [newInquiry, ...prev.inquiries],
    }));
  };

  const updateInquiryStatus = (id: string, status: Inquiry["status"]) => {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
    }));
  };

  const deleteInquiry = (id: string) => {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.filter((inq) => inq.id !== id),
    }));
  };

  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === "object") {
        setData({
          settings: { ...DEFAULT_SITE_SETTINGS, ...(parsed.settings || {}) },
          team: Array.isArray(parsed.team) ? parsed.team : DEFAULT_TEAM_MEMBERS,
          projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS,
          services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SERVICES,
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_FAQS,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : DEFAULT_INQUIRIES,
        });
        return true;
      }
    } catch (e) {
      console.error("Failed to import JSON data:", e);
    }
    return false;
  };

  const resetToDefaults = () => {
    setData(INITIAL_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        data,
        updateSettings,
        updateTeamMember,
        addTeamMember,
        deleteTeamMember,
        reorderTeam,
        updateProject,
        addProject,
        deleteProject,
        reorderProjects,
        updateService,
        addService,
        deleteService,
        updateFaq,
        addFaq,
        deleteFaq,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        exportDataJson,
        importDataJson,
        resetToDefaults,
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
}

export function useWebsiteData() {
  const ctx = useContext(WebsiteDataContext);
  if (!ctx) {
    throw new Error("useWebsiteData must be used within a WebsiteDataProvider");
  }
  return ctx;
}
