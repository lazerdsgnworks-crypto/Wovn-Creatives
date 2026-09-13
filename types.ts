export interface TeamMember {
  id: string;
  number?: string;
  name: string;
  role: string;
  image: string;
  link: string;
}

export interface WorkProject {
  id: string;
  number: string;
  title: string;
  desc: string;
  image: string;
  meta: string[];
  accent: string;
  credit?: string;
  creditUrl?: string;
}

export interface ServiceDeliverable {
  title: string;
  description?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  badge: string;
  titleLines: string[];
  tagline: string;
  deliverables: ServiceDeliverable[];
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  date: string;
  status: "new" | "in-review" | "replied" | "archived";
}

export interface SiteSettings {
  agencyName: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  calLink: string;
  contactEmail: string;
  phone: string;
  location: string;
  instagramUrl: string;
  linkedinUrl: string;
  xUrl: string;
  heroSpeed: number;
  heroCards: number;
}

export interface WebsiteData {
  settings: SiteSettings;
  team: TeamMember[];
  projects: WorkProject[];
  services: ServiceItem[];
  faqs: FaqItem[];
  inquiries: Inquiry[];
}
