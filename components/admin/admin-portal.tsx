"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  HelpCircle,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Phone,
  Globe,
  AlertCircle,
  Copy,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWebsiteData } from "@/context/website-data-context";
import { useTheme } from "@/context/theme-context";
import {
  TeamMember,
  WorkProject,
  ServiceItem,
  FaqItem,
  Inquiry,
  SiteSettings,
} from "@/types";

interface AdminPortalProps {
  onBackToSite: () => void;
}

const AUTH_STORAGE_KEY = "wovn_admin_session_auth";
const ADMIN_CORRECT_PASS = "Ash1211&";

export function AdminPortal({ onBackToSite }: AdminPortalProps) {
  const { theme, toggleTheme } = useTheme();
  const {
    data,
    updateSettings,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    updateProject,
    addProject,
    deleteProject,
    updateService,
    addService,
    deleteService,
    updateFaq,
    addFaq,
    deleteFaq,
    updateInquiryStatus,
    deleteInquiry,
    exportDataJson,
    importDataJson,
    resetToDefaults,
  } = useWebsiteData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      sessionStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
      localStorage.getItem(AUTH_STORAGE_KEY) === "true"
    );
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "team" | "services" | "hero" | "faqs" | "inquiries" | "backup"
  >("overview");

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_CORRECT_PASS) {
      setIsAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      }
      showToast("Welcome to WOVN Admin Dashboard");
    } else {
      setLoginAttempts((prev) => prev + 1);
      setAuthError("Incorrect password. Please verify your team credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast("Logged out successfully");
  };

  /* ---------------- Modals State ---------------- */
  // Project Modal
  const [editingProject, setEditingProject] = useState<WorkProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Team Modal
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Service Modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // FAQ Modal
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Hero settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(data.settings);
  useEffect(() => {
    setSettingsForm(data.settings);
  }, [data.settings]);

  /* ---------------- Render: Login Gate ---------------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-white flex flex-col justify-between font-sans selection:bg-white selection:text-black">
        {/* Top bar */}
        <div className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Website</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span>PORTAL VERIFICATION</span>
          </div>
        </div>

        {/* Center Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-12 w-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-4 text-white shadow-inner">
                <Lock className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                WOVN CREATIVES
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                ADMIN ACCESS PORTAL
              </p>
              <p className="text-xs text-zinc-500 mt-2 max-w-xs">
                Enter your authorized team access key to manage portfolio works, team roster, services, and live website configurations.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    placeholder="Enter security key..."
                    autoFocus
                    className="w-full px-4 py-3.5 pr-12 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-rose-400 text-xs py-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-white focus:ring-0"
                  />
                  <span>Remember session on this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Unlock className="h-4 w-4" />
                <span>Unlock Dashboard</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500">
              Authorized team members: Umar Arif & Uzair Arif.
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="p-6 text-center text-xs text-zinc-600 font-mono">
          WOVN CREATIVES CMS &bull; All changes immediately sync across your website
        </div>
      </div>
    );
  }

  /* ---------------- Render: Authenticated Dashboard ---------------- */
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      {/* Top Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-zinc-800 text-xs font-medium"
          >
            <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold tracking-tight text-lg text-zinc-950 dark:text-white">
              <span>WOVN CREATIVES</span>
              <span className="text-[10px] font-mono uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md font-semibold">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link: Visit Public Website */}
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Website</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none py-2 border-t border-zinc-100 dark:border-zinc-800/60">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "projects", label: `Our Work (${data.projects.length})`, icon: Briefcase },
            { id: "team", label: `Team (${data.team.length})`, icon: Users },
            { id: "services", label: `Services (${data.services.length})`, icon: Layers },
            { id: "hero", label: "Hero & Branding", icon: Sparkles },
            { id: "faqs", label: `FAQs & Policies (${data.faqs.length})`, icon: HelpCircle },
            { id: "inquiries", label: `Inquiries (${data.inquiries.length})`, icon: Mail },
            { id: "backup", label: "Data & Backup", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Studio Management Overview
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Real-time dashboard for WOVN CREATIVES. Any updates applied here are immediately reflected across the live website.
              </p>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-mono uppercase tracking-wider">Work Items</span>
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-zinc-950 dark:text-white">
                  {data.projects.length}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Live portfolio showcases</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-mono uppercase tracking-wider">Team Roster</span>
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-zinc-950 dark:text-white">
                  {data.team.length}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Founders & core talents</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-mono uppercase tracking-wider">Client Inquiries</span>
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-zinc-950 dark:text-white">
                  {data.inquiries.length}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  {data.inquiries.filter((i) => i.status === "new").length} new unread
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-zinc-500 dark:text-zinc-400">
                  <span className="text-xs font-mono uppercase tracking-wider">Site Status</span>
                  <Globe className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  Live &amp; Synced
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Fast client hydration</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4">
                Quick Shortcuts
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Work Project</span>
                </button>
                <button
                  onClick={() => {
                    setEditingTeamMember(null);
                    setIsTeamModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Team Member</span>
                </button>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Review Inquiries</span>
                </button>
                <button
                  onClick={() => setActiveTab("hero")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Edit Hero &amp; Cal.com Link</span>
                </button>
              </div>
            </div>

            {/* Quick Live Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team preview */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                    Team Members
                  </h3>
                  <button
                    onClick={() => setActiveTab("team")}
                    className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage all</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {data.team.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-9 w-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                        <div>
                          <div className="text-xs font-bold text-zinc-950 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-zinc-500">{member.role}</div>
                        </div>
                      </div>
                      <a
                        href={member.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white p-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio preview */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                    Featured Portfolio Works
                  </h3>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage all</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {data.projects.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-9 w-9 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                        <div>
                          <div className="text-xs font-bold text-zinc-950 dark:text-white">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                            {project.desc}
                          </div>
                        </div>
                      </div>
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: project.accent || "#7b61ff" }}
                        title={`Accent: ${project.accent}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS / OUR WORK */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Our Work &amp; Portfolio Showcase
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Manage the projects shown in the Home Page Zoom Slider and the full-bleed Our Work showcase.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.projects.map((project, idx) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between shadow-sm group hover:border-zinc-400 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-white">
                      #{project.number || String(idx + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="absolute top-3 right-3 h-4 w-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: project.accent }}
                      title={`Accent: ${project.accent}`}
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-zinc-950 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                        {project.desc}
                      </p>
                      {project.meta && project.meta.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.meta.map((m, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="text-[11px] font-mono text-zinc-400">
                        {project.credit || "WOVN CREATIVES"}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsProjectModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${project.title}"?`)) {
                              deleteProject(project.id);
                              showToast(`Project "${project.title}" deleted.`);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM MEMBERS */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Team Members &amp; Leadership
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Manage the talents displayed in the Kinetic Team section on the home page.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTeamMember(null);
                  setIsTeamModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.team.map((member, idx) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400">
                          #{member.number || String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-bold text-base text-zinc-950 dark:text-white truncate">
                          {member.name}
                        </h3>
                      </div>
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {member.role}
                      </p>
                      {member.link && (
                        <a
                          href={member.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-950 dark:hover:text-white mt-2 truncate max-w-full"
                        >
                          <Globe className="h-3 w-3 shrink-0" />
                          <span className="truncate">{member.link.replace(/^https?:\/\//, "")}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => {
                        setEditingTeamMember(member);
                        setIsTeamModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${member.name} from the team roster?`)) {
                          deleteTeamMember(member.id);
                          showToast(`Team member "${member.name}" removed.`);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Studio Services &amp; Deliverables
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Customize the services and bullet offerings presented in the Story Scroll / Services section.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsServiceModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                          {service.badge}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {service.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white mt-1">
                        {service.titleLines.join(" ")}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
                        {service.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setIsServiceModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete service "${service.titleLines.join(" ")}"?`)) {
                            deleteService(service.id);
                            showToast("Service deleted.");
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Deliverables list */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                      Included Deliverables:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {service.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 text-xs"
                        >
                          <div className="font-bold text-zinc-950 dark:text-white">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HERO & BRANDING */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Hero Section &amp; Studio Configurations
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Customize the hero headline ("Generic? Maybe try us."), Cal.com booking link, emails, and phone numbers.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSettings(settingsForm);
                showToast("Studio settings saved successfully!");
              }}
              className="space-y-6 max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Hero Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadingLine1}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroHeadingLine1: e.target.value })
                    }
                    placeholder="Generic?"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Hero Headline Line 2
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadingLine2}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroHeadingLine2: e.target.value })
                    }
                    placeholder="Maybe try us."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Cal.com Booking Slug
                  </label>
                  <input
                    type="text"
                    value={settingsForm.calLink}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, calLink: e.target.value })
                    }
                    placeholder="wovn-creatives/w"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:border-zinc-500"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Direct Cal.com path used for embedded booking widgets.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                    }
                    placeholder="wovn.hq@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Studio Location
                  </label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, location: e.target.value })
                    }
                    placeholder="Lahore, Pakistan"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Studio Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.linkedinUrl}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })
                    }
                    placeholder="https://linkedin.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: FAQS & POLICIES */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Frequently Asked Questions &amp; Policies
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Manage the 15 standard studio FAQs and policy responses.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingFaq(null);
                  setIsFaqModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.faqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-400">
                        Q{idx + 1}.
                      </span>
                      <h3 className="font-bold text-sm text-zinc-950 dark:text-white">
                        {faq.q}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 pl-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsFaqModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Edit question"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete FAQ "${faq.q}"?`)) {
                          deleteFaq(faq.id);
                          showToast("FAQ removed.");
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Client Inquiries &amp; Leads
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Submissions from prospective clients via the website contact page.
              </p>
            </div>

            {data.inquiries.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <Mail className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  No inquiries received yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-base text-zinc-950 dark:text-white">
                            {inq.name}
                          </h3>
                          {inq.company && (
                            <span className="text-xs text-zinc-500 font-medium">
                              &bull; {inq.company}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                              inq.status === "new"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : inq.status === "in-review"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mt-1">
                          <a
                            href={`mailto:${inq.email}`}
                            className="hover:text-zinc-950 dark:hover:text-white underline"
                          >
                            {inq.email}
                          </a>
                          {inq.service && <span>Service: {inq.service}</span>}
                          {inq.budget && <span>Budget: {inq.budget}</span>}
                          <span>{new Date(inq.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Status changer & Actions */}
                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            updateInquiryStatus(inq.id, e.target.value as any)
                          }
                          className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-medium"
                        >
                          <option value="new">Mark New</option>
                          <option value="in-review">In Review</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <a
                          href={`mailto:${inq.email}?subject=Regarding your project inquiry with WOVN CREATIVES`}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                        >
                          Reply Email
                        </a>
                        <button
                          onClick={() => {
                            if (confirm("Delete this inquiry record?")) {
                              deleteInquiry(inq.id);
                              showToast("Inquiry deleted.");
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      "{inq.message}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: BACKUP & DATA MANAGER */}
        {activeTab === "backup" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Data Management &amp; Backups
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Export your full website database to JSON, restore snapshots, or reset to initial default baseline.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white mb-1">
                  Export Website Data Snapshot
                </h3>
                <p className="text-xs text-zinc-500 mb-3">
                  Download an exact JSON snapshot of all current projects, team members, services, hero configurations, and FAQs.
                </p>
                <button
                  onClick={() => {
                    const json = exportDataJson();
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `wovn-creatives-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast("Backup downloaded successfully!");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download JSON Backup</span>
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white mb-1">
                  Restore from JSON Backup
                </h3>
                <p className="text-xs text-zinc-500 mb-3">
                  Upload a previously saved JSON snapshot to restore all content.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload &amp; Restore Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content && importDataJson(content)) {
                          showToast("Backup restored successfully!");
                        } else {
                          alert("Invalid JSON backup file structure.");
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">
                  Reset to Original Studio Defaults
                </h3>
                <p className="text-xs text-zinc-500 mb-3">
                  Revert all works, portraits, services, and FAQs back to the initial agency design.
                </p>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to revert all content to initial factory defaults? This action cannot be undone unless you have a JSON backup."
                      )
                    ) {
                      resetToDefaults();
                      showToast("Reverted to initial studio defaults.");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Data to Default</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------- PROJECT MODAL ---------------- */}
      {isProjectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={(projectData) => {
            if (editingProject) {
              updateProject({ ...editingProject, ...projectData });
              showToast(`Updated "${projectData.title}"`);
            } else {
              addProject(projectData);
              showToast(`Added "${projectData.title}"`);
            }
            setIsProjectModalOpen(false);
          }}
        />
      )}

      {/* ---------------- TEAM MODAL ---------------- */}
      {isTeamModalOpen && (
        <TeamModal
          member={editingTeamMember}
          onClose={() => setIsTeamModalOpen(false)}
          onSave={(memberData) => {
            if (editingTeamMember) {
              updateTeamMember({ ...editingTeamMember, ...memberData });
              showToast(`Updated team member "${memberData.name}"`);
            } else {
              addTeamMember(memberData);
              showToast(`Added team member "${memberData.name}"`);
            }
            setIsTeamModalOpen(false);
          }}
        />
      )}

      {/* ---------------- SERVICE MODAL ---------------- */}
      {isServiceModalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => setIsServiceModalOpen(false)}
          onSave={(serviceData) => {
            if (editingService) {
              updateService({ ...editingService, ...serviceData });
              showToast(`Updated service "${serviceData.badge}"`);
            } else {
              addService(serviceData);
              showToast(`Added service "${serviceData.badge}"`);
            }
            setIsServiceModalOpen(false);
          }}
        />
      )}

      {/* ---------------- FAQ MODAL ---------------- */}
      {isFaqModalOpen && (
        <FaqModal
          faq={editingFaq}
          onClose={() => setIsFaqModalOpen(false)}
          onSave={(faqData) => {
            if (editingFaq) {
              updateFaq({ ...editingFaq, ...faqData });
              showToast("Updated FAQ.");
            } else {
              addFaq(faqData);
              showToast("Added FAQ.");
            }
            setIsFaqModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Sub-Modals ---------------- */

function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: WorkProject | null;
  onClose: () => void;
  onSave: (data: Omit<WorkProject, "id">) => void;
}) {
  const [title, setTitle] = useState(project?.title || "");
  const [desc, setDesc] = useState(project?.desc || "");
  const [image, setImage] = useState(project?.image || "");
  const [accent, setAccent] = useState(project?.accent || "#7b61ff");
  const [metaStr, setMetaStr] = useState(project?.meta?.join(", ") || "2026, 3D & SPATIAL, GLOBAL");
  const [number, setNumber] = useState(project?.number || "01");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">
          {project ? "Edit Work Project" : "Add New Work Project"}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Number
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Aura Atmosphere"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Short Description / Subtitle
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Soft light and iridescent atmospheric tones"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Image URL (Direct link)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono"
            />
            {image && (
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <img
                  src={image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Accent Color (Hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-9 w-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Meta Tags (comma separated)
              </label>
              <input
                type="text"
                value={metaStr}
                onChange={(e) => setMetaStr(e.target.value)}
                placeholder="2026, 3D, PARIS"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!title.trim() || !image.trim()) {
                alert("Please provide both Title and Image URL.");
                return;
              }
              onSave({
                number,
                title,
                desc,
                image,
                accent,
                meta: metaStr.split(",").map((s) => s.trim()).filter(Boolean),
                credit: "WOVN CREATIVES",
                creditUrl: "https://www.instagram.com/wovncreatives",
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Save Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TeamModal({
  member,
  onClose,
  onSave,
}: {
  member: TeamMember | null;
  onClose: () => void;
  onSave: (data: Omit<TeamMember, "id">) => void;
}) {
  const [name, setName] = useState(member?.name || "");
  const [role, setRole] = useState(member?.role || "");
  const [image, setImage] = useState(member?.image || "");
  const [link, setLink] = useState(member?.link || "");
  const [number, setNumber] = useState(member?.number || "01");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">
          {member ? "Edit Team Member" : "Add New Team Member"}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Order
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Umar Arif"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Role / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder / Co-Founder"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Portrait Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono"
            />
            {image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Portrait preview"
                  className="h-14 w-14 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <span className="text-xs text-zinc-500">Avatar Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Profile URL (LinkedIn or Instagram)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!name.trim() || !role.trim() || !image.trim()) {
                alert("Please provide Name, Role, and Image URL.");
                return;
              }
              onSave({ number, name, role, image, link });
            }}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Save Member
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onSave: (data: Omit<ServiceItem, "id">) => void;
}) {
  const [badge, setBadge] = useState(service?.badge || "Design & Build");
  const [number, setNumber] = useState(service?.number || "01 — UI/UX Design (Framer)");
  const [titleStr, setTitleStr] = useState(service?.titleLines.join(" ") || "UI/UX DESIGN");
  const [tagline, setTagline] = useState(service?.tagline || "");
  const [deliverablesStr, setDeliverablesStr] = useState(
    service?.deliverables.map((d) => d.title).join("\n") || "Wireframes & prototypes\nHigh-fidelity UI design"
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">
          {service ? "Edit Service" : "Add New Service"}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Design & Build"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">
                Number Prefix
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01 — UI/UX"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Title
            </label>
            <input
              type="text"
              value={titleStr}
              onChange={(e) => setTitleStr(e.target.value)}
              placeholder="UI/UX DESIGN"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Tagline
            </label>
            <textarea
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Crafting intuitive, high-converting digital experiences..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Deliverables (One item per line)
            </label>
            <textarea
              rows={4}
              value={deliverablesStr}
              onChange={(e) => setDeliverablesStr(e.target.value)}
              placeholder="Wireframes & prototypes&#10;High-fidelity UI design"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const deliverables = deliverablesStr
                .split("\n")
                .map((d) => d.trim())
                .filter(Boolean)
                .map((title) => ({ title }));

              onSave({
                number,
                badge,
                titleLines: titleStr.split(" ").filter(Boolean),
                tagline,
                deliverables,
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Save Service
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function FaqModal({
  faq,
  onClose,
  onSave,
}: {
  faq: FaqItem | null;
  onClose: () => void;
  onSave: (data: Omit<FaqItem, "id">) => void;
}) {
  const [q, setQ] = useState(faq?.q || "");
  const [a, setA] = useState(faq?.a || "");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">
          {faq ? "Edit FAQ" : "Add FAQ Question"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Question
            </label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. How do I start a project with you?"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">
              Answer
            </label>
            <textarea
              rows={4}
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="Reach out via our website, email, or social media..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!q.trim() || !a.trim()) {
                alert("Please fill both question and answer.");
                return;
              }
              onSave({ q, a });
            }}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Save FAQ
          </button>
        </div>
      </motion.div>
    </div>
  );
}
