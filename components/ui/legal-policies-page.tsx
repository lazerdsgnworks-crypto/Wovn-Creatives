"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Shield, FileText, CreditCard, HelpCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWebsiteData } from "@/context/website-data-context";

export type LegalTab = "all" | "privacy" | "terms" | "payments" | "faqs";

interface LegalPoliciesPageProps {
  initialTab?: LegalTab;
  onBack: () => void;
  onContact: () => void;
}

const FAQS_DATA = [
  {
    q: "What services does Wovn Creatives offer?",
    a: "We offer UI/UX design (including Framer websites), branding, social media management, web development, and AI automation services.",
  },
  {
    q: "Where is Wovn Creatives based?",
    a: "We are based in Lahore, Pakistan, and work with clients both locally and internationally.",
  },
  {
    q: "How do I start a project with you?",
    a: "Reach out via our website, email, or social media to book a discovery call. We'll discuss your goals, share a proposal, and get started once the agreement and deposit are confirmed.",
  },
  {
    q: "How long does a typical project take?",
    a: "Timelines vary by service — a Framer website may take 2–4 weeks, branding 1–3 weeks, while social media management and AI automations are ongoing engagements. Exact timelines are shared in your proposal.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We work with clients worldwide and accept international payments through Payoneer, Wise, and bank transfers.",
  },
  {
    q: "What is your payment structure?",
    a: "Typically 50% upfront and 50% on completion for one-off projects, or monthly in advance for retainer-based services like social media management.",
  },
  {
    q: "Can I get a refund if I change my mind?",
    a: "Deposits are non-refundable once work begins. Please see our Payment & Refund Policy for full details.",
  },
  {
    q: "How many revisions are included?",
    a: "Most packages include 1–2 rounds of revisions. Additional revisions beyond the agreed scope are billed separately.",
  },
  {
    q: "Who owns the final designs/website/content?",
    a: "Once full payment is received, ownership of the final deliverables transfers to you. We may showcase the work in our portfolio unless you request otherwise.",
  },
  {
    q: "Do you offer website maintenance after launch?",
    a: "Yes, we offer optional monthly maintenance and support packages for websites and automations after launch.",
  },
  {
    q: "What platforms do you build websites on?",
    a: "Primarily Framer for fast, design-forward builds, along with custom development and other CMS platforms depending on project needs.",
  },
  {
    q: "Can you manage our social media accounts directly?",
    a: "Yes, we offer full social media management including content creation, scheduling, posting, and monthly performance reporting.",
  },
  {
    q: "What tools do you use for AI automation?",
    a: "We typically build automations using tools like Make, Zapier, n8n, and custom AI integrations depending on your existing tech stack.",
  },
  {
    q: "Is my business/project information kept confidential?",
    a: "Yes. All client information and project details are kept confidential and are only shared internally or with authorized subcontractors under confidentiality obligations.",
  },
  {
    q: "How can I contact Wovn Creatives?",
    a: "You can reach us via email at wovn.hq@gmail.com, our website contact form, or direct message on our social channels.",
  },
];

export function LegalPoliciesPage({
  initialTab = "all",
  onBack,
  onContact,
}: LegalPoliciesPageProps) {
  const { data } = useWebsiteData();
  const faqsList = data?.faqs && data.faqs.length > 0 ? data.faqs : FAQS_DATA;
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0, 1]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070709] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 font-sans tracking-[-0.02em] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Studio</span>
          </button>
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Effective: September 2026
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 mb-3">
            WOVN CREATIVES
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            Privacy, Terms & FAQs
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Our comprehensive policy framework outlining client collaboration standards, intellectual property rights, transparent payment terms, and frequent questions.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-12">
          {[
            { id: "all", label: "All Policies", icon: FileText },
            { id: "privacy", label: "1.1 Privacy Policy", icon: Shield },
            { id: "terms", label: "1.2 Terms & IP", icon: FileText },
            { id: "payments", label: "2. Payments & Refunds", icon: CreditCard },
            { id: "faqs", label: "3. FAQs", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="space-y-16 text-zinc-800 dark:text-zinc-300 text-sm sm:text-[15px] leading-relaxed">
          {/* 1.1 PRIVACY POLICY */}
          {(activeTab === "all" || activeTab === "privacy") && (
            <section id="privacy-section" className="scroll-mt-28 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <Shield className="h-5 w-5 text-zinc-950 dark:text-white" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  1. Privacy & Policies
                </h2>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                  1.1 Privacy Policy
                </h3>
                
                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-4 mb-2">
                  Information We Collect
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li>
                    <strong className="text-zinc-900 dark:text-zinc-200">Personal details:</strong> Name, email, phone number, company name, billing address provided when contacting us or signing agreements.
                  </li>
                  <li>
                    <strong className="text-zinc-900 dark:text-zinc-200">Project information:</strong> Brand assets, briefs, login credentials for platforms authorized to work on, and content files.
                  </li>
                  <li>
                    <strong className="text-zinc-900 dark:text-zinc-200">Payment information:</strong> Processed through third-party payment gateways or bank transfers (we do not store full card details on our servers).
                  </li>
                  <li>
                    <strong className="text-zinc-900 dark:text-zinc-200">Website usage data:</strong> IP address, browser type, pages visited, collected via cookies or analytics tools.
                  </li>
                  <li>
                    <strong className="text-zinc-900 dark:text-zinc-200">Communication records:</strong> Emails, WhatsApp messages, and call notes related to your project.
                  </li>
                </ul>

                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-6 mb-2">
                  How We Use Your Information
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li>To deliver, manage, and communicate about the services hired.</li>
                  <li>To send invoices, contracts, proposals, and project updates.</li>
                  <li>To improve our website, services, and client experience.</li>
                  <li>To send occasional marketing updates or portfolio highlights (only with explicit consent; unsubscribe anytime).</li>
                  <li>To comply with legal or tax obligations under Pakistani law.</li>
                </ul>

                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-6 mb-2">
                  How We Protect Your Information
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We take reasonable technical and organizational measures to protect your data, including restricted internal access, secure file-sharing tools, and confidentiality agreements with our team and contractors. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-6 mb-2">
                  Sharing of Information & Cookies
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                  We do not sell, rent, or trade your personal information. We may share information with trusted third parties (such as payment processors, hosting providers, or subcontracted team members) strictly for delivering your project under confidentiality obligations.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Our website may use cookies to improve browsing experience and gather anonymous usage statistics. You can disable cookies through your browser settings anytime.
                </p>

                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-6 mb-2">
                  Your Rights & Data Retention
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  You have the right to request access to the personal data we hold about you, request correction or deletion (subject to legal retention requirements), and withdraw consent for marketing communications. We retain data as long as necessary for legal, accounting, and portfolio purposes unless earlier deletion is requested.
                </p>
              </div>
            </section>
          )}

          {/* 1.2 TERMS & CONDITIONS / REVISIONS / IP */}
          {(activeTab === "all" || activeTab === "terms") && (
            <section id="terms-section" className="scroll-mt-28 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <FileText className="h-5 w-5 text-zinc-950 dark:text-white" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  1.2 Terms & Conditions & Project Policies
                </h2>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">
                  Services & Project Process
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                  Wovn Creatives provides UI/UX design (including Framer builds), branding, social media management, web development, and AI automation services. Scope, deliverables, and timelines are confirmed in writing before kickoff.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li>A discovery call or brief is required before any proposal is issued.</li>
                  <li>Projects begin only after a signed agreement and initial deposit are received.</li>
                  <li>Timelines are estimates and may shift due to delayed feedback, content, or approvals.</li>
                  <li>Clients are expected to respond to review requests within 3–5 business days to maintain schedule.</li>
                </ul>

                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-6 mb-2">
                  Client Responsibilities & Liability Limits
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                  Clients are responsible for providing accurate project information, brand assets, securing licenses for provided content, and reviewing deliverables within agreed revision windows.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Wovn Creatives is not liable for indirect, incidental, or consequential damages. Our total liability for any claim is limited strictly to the amount paid for the specific service in question. We are not responsible for outages or policy shifts by third-party tools (Framer, Meta, Google, Zapier, Make, OpenAI/Anthropic).
                </p>

                <h4 className="font-semibold text-zinc-950 dark:text-zinc-200 mt-6 mb-2">
                  Termination & Governing Law
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Either party may terminate an engagement with written notice. Completed work will be invoiced and non-refundable deposits will not be returned. These terms are governed by the laws of Pakistan, with disputes addressed through good-faith negotiation and appropriate courts in Lahore, Pakistan.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                  1.3 Revision & Project Policy
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                  Each service package includes a set number of revision rounds (typically 1–2 rounds). Scope expansions are quoted separately.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li><strong>UI/UX & Branding:</strong> Revisions apply to design direction, layout, and content adjustments — not full concept restarts after approval.</li>
                  <li><strong>Web Development:</strong> Bug fixes within 14 days of launch are covered at no charge. Feature additions are billed separately.</li>
                  <li><strong>Social Media Management:</strong> Content revisions must be requested before scheduled posting dates.</li>
                  <li><strong>AI Automations:</strong> Includes testing and adjustment during setup; ongoing optimization beyond agreed scope is billed as a separate retainer.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                  1.4 Intellectual Property Policy
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li>Full ownership of final, approved deliverables (logos, designs, code, content) transfers to the client upon full payment.</li>
                  <li>Wovn Creatives retains the right to showcase completed projects in our portfolio, website, and social media, unless confidentiality is requested in writing.</li>
                  <li>Any third-party assets used (stock photos, fonts, plugins) remain subject to their original licensing terms.</li>
                  <li>Working source files may be provided at an additional cost if not included in the original package.</li>
                </ul>
              </div>
            </section>
          )}

          {/* 2. PAYMENTS */}
          {(activeTab === "all" || activeTab === "payments") && (
            <section id="payments-section" className="scroll-mt-28 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <CreditCard className="h-5 w-5 text-zinc-950 dark:text-white" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  2. Payments & Refund Policy
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-2">
                    2.1 Payment Structure
                  </h3>
                  <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>50% advance deposit</strong> required before kickoff.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Remaining balance</strong> due upon completion prior to final handover.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Monthly retainers</strong> billed in advance.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-2">
                    2.2 Accepted Payment Methods
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                    Bank transfer, JazzCash/EasyPaisa, and international payment rails (Payoneer, Wise) for global clients.
                  </p>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    Late Payments: Work pauses if payments are overdue. Late fees apply per contract terms.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-3">
                  2.4 Refund Policy
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li>Deposits are non-refundable once work has commenced as they reserve team capacity and initial research.</li>
                  <li>If a project is cancelled before work commences, the deposit may be refunded minus an administrative fee.</li>
                  <li>No refunds are issued for completed and delivered deliverables or rendered retainer periods.</li>
                  <li>In case of failure to deliver on our part with no work provided, a full refund will be issued.</li>
                </ul>
              </div>
            </section>
          )}

          {/* 3. FREQUENTLY ASKED QUESTIONS */}
          {(activeTab === "all" || activeTab === "faqs") && (
            <section id="faqs-section" className="scroll-mt-28 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <HelpCircle className="h-5 w-5 text-zinc-950 dark:text-white" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  3. Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {faqsList.map((faq, idx) => {
                  const isOpen = openFaqIndices.includes(idx);
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left font-medium text-zinc-950 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <span className="text-base font-semibold">{faq.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-300 text-zinc-500 ${
                            isOpen ? "rotate-180 text-zinc-950 dark:text-white" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bottom CTA Block */}
          <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 dark:bg-zinc-900 text-white text-center flex flex-col items-center justify-center gap-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Have a question not covered here?
            </h3>
            <p className="text-sm text-zinc-400 max-w-md">
              Reach out directly to our team. We are always happy to discuss scope, timelines, and custom requirements.
            </p>
            <button
              onClick={onContact}
              className="mt-2 px-6 py-3 rounded-full bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Contact Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalPoliciesPage;
