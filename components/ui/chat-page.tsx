import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cleanChatReply } from "@/lib/utils";
import { useWebsiteData } from "@/context/website-data-context";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { FormattedMessage } from "@/components/ui/formatted-message";
import { CurvedNavbar } from "@/components/ui/curved-menu";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  Plus,
  SquarePen,
  Trash2,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  LogIn,
  LogOut,
  User,
  Menu,
} from "lucide-react";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
}

// Generate or retrieve persistent local client ID for anonymous tracking
const getClientId = (): string => {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem("wovn_chat_user_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
    localStorage.setItem("wovn_chat_user_id", id);
  }
  return id;
};

interface ChatPageProps {
  onBackToHome: () => void;
  onNavigate?: (page: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onBackToHome, onNavigate }) => {
  const { data: websiteData } = useWebsiteData();
  const { user, openAuthModal, logout } = useAuth();
  const { theme } = useTheme();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => "session_" + Date.now());
  const [isCurrentSessionSaved, setIsCurrentSessionSaved] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const clientId = user ? user.uid : getClientId();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (id: string, text: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  // Auto-close sidebar on small screens initially for better mobile UX
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  // Load Sessions from Firebase Firestore ONLY when user is logged in
  useEffect(() => {
    if (!user) {
      // Unauthenticated users do not have saved recent chats
      setSessions([]);
      setLoadingSessions(false);
      return;
    }

    setLoadingSessions(true);
    try {
      const sessionsRef = collection(db, "chat_sessions");
      const q = query(
        sessionsRef,
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: ChatSession[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // Only include sessions that have at least one message or were saved
            if (data.isSaved !== false) {
              loaded.push({
                id: docSnap.id,
                title: data.title || "Chat",
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
                updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt || Date.now(),
                messageCount: data.messageCount || 1,
              });
            }
          });

          setSessions(loaded);
          setLoadingSessions(false);
        },
        (error) => {
          console.warn("Firestore sessions listener warning:", error);
          setLoadingSessions(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore init error:", err);
      setLoadingSessions(false);
    }
  }, [user]);

  // Listen to messages for active session in real-time ONLY if user is logged in & session is saved
  useEffect(() => {
    if (!user || !isCurrentSessionSaved || !activeSessionId) {
      return;
    }

    try {
      const messagesRef = collection(db, "chat_sessions", activeSessionId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: ChatMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loaded.push({
              id: docSnap.id,
              role: data.role || "model",
              text: data.text || "",
              timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : data.timestamp || Date.now(),
            });
          });

          if (loaded.length > 0) {
            setMessages(loaded);
          }
        },
        (err) => {
          console.warn("Messages snapshot note:", err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Messages subcollection note:", err);
    }
  }, [user, isCurrentSessionSaved, activeSessionId]);

  // Start a fresh, new chat: brand-new session not listed in recent chats
  const createNewChat = (focusInput = true) => {
    const newSessionId = "session_" + Date.now();
    setActiveSessionId(newSessionId);
    setIsCurrentSessionSaved(false);
    setMessages([]);
    setInputValue("");

    if (focusInput) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  // Select an existing past chat session (when logged in)
  const handleSelectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsCurrentSessionSaved(true);
    setMessages([]);

    if (user) {
      try {
        const messagesRef = collection(db, "chat_sessions", sessionId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const snapshot = await getDocs(q);
        const loaded: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            role: data.role || "model",
            text: data.text || "",
            timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : data.timestamp || Date.now(),
          });
        });
        setMessages(loaded);
      } catch (e) {
        console.warn("Error fetching session messages:", e);
      }
    }
  };

  // Delete chat session (when logged in)
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await deleteDoc(doc(db, "chat_sessions", sessionId));
    } catch (err) {
      console.warn("Delete session error:", err);
    }

    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      createNewChat(false);
    }
  };

  // Send message to backend and persist conditionally ONLY if user is logged in
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || isAiTyping) return;

    const targetSessionId = activeSessionId || ("session_" + Date.now());
    const isFirstMessage = messages.length === 0;

    const userMsgId = "msg_user_" + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsAiTyping(true);

    // Save to Firestore ONLY if user is logged in
    if (user) {
      try {
        if (!isCurrentSessionSaved || isFirstMessage) {
          const autoTitle = text.length > 28 ? text.slice(0, 28) + "..." : text;
          const sessionDocRef = doc(db, "chat_sessions", targetSessionId);
          await setDoc(sessionDocRef, {
            id: targetSessionId,
            userId: user.uid,
            userEmail: user.email || "",
            title: autoTitle,
            isSaved: true,
            messageCount: 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setIsCurrentSessionSaved(true);
        }

        const messagesRef = collection(db, "chat_sessions", targetSessionId, "messages");
        await addDoc(messagesRef, {
          role: "user",
          text,
          timestamp: serverTimestamp(),
        });

        await updateDoc(doc(db, "chat_sessions", targetSessionId), {
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Error writing message to Firestore:", err);
      }
    }

    // Prepare context for backend proxy
    const settings = websiteData?.settings;
    const team = websiteData?.team || [];
    const projects = websiteData?.projects || [];
    const services = websiteData?.services || [];

    const contextSummary = `
Agency: ${settings?.agencyName || "WOVN CREATIVES"}
Tagline: "${settings?.heroHeadingLine1 || "Generic?"} ${settings?.heroHeadingLine2 || "Maybe try us."}"
Location: ${settings?.location || "Lahore, Pakistan"}
Email: ${settings?.contactEmail || "wovn.hq@gmail.com"}
Cal Link: https://cal.com/${settings?.calLink || "wovn-creatives/w"}
Team (${team.length}): ${team.map((t) => `${t.name} (${t.role})`).join(", ")}
Services (${services.length}): ${services.map((s) => `${s.number} - ${s.tagline}`).join(" | ")}
Projects (${projects.length}): ${projects.map((p) => `${p.title} (${p.desc})`).join(", ")}
    `.trim();

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      // Strictly pass userId, sessionId, chatInput / message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatInput: text,
          userId: user ? user.uid : clientId,
          sessionId: targetSessionId,
          history: historyPayload,
          contextData: contextSummary,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      const rawText =
        resData?.text ||
        resData?.message ||
        resData?.output ||
        "Thank you for reaching out to Wovn Creatives.";
      const botText = cleanChatReply(rawText);

      const botMsg: ChatMessage = {
        id: "msg_bot_" + Date.now(),
        role: "model",
        text: botText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save bot response to Firestore ONLY if user is logged in
      if (user) {
        try {
          const messagesRef = collection(db, "chat_sessions", targetSessionId, "messages");
          await addDoc(messagesRef, {
            role: "model",
            text: botText,
            timestamp: serverTimestamp(),
          });
        } catch (err) {
          console.warn("Error saving bot message to Firestore:", err);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackReply = cleanChatReply(
        "Wovn Creatives is a premier creative studio specializing in UI/UX Design (Framer), Visual Branding & Identity, Modern Web Engineering, 3D Kinetic Visuals, and AI Automations. You can reach our team directly at wovn.hq@gmail.com or book a strategy call at cal.com/wovn-creatives/w."
      );

      const botMsg: ChatMessage = {
        id: "msg_bot_" + Date.now(),
        role: "model",
        text: fallbackReply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsAiTyping(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-screen bg-black text-white font-sans antialiased overflow-hidden select-none">
      {/* Mobile Backdrop Overlay when sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs md:hidden transition-opacity duration-300"
        />
      )}

      {/* LEFT SIDEBAR: Suspended pill-contoured border in middle */}
      <aside
        className={`fixed md:relative z-40 flex flex-col justify-center h-full bg-black py-4 sm:py-6 md:py-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-[260px] sm:w-[290px] md:w-[310px] translate-x-0 opacity-100"
            : "-translate-x-full md:w-0 md:translate-x-0 md:opacity-0 pointer-events-none md:overflow-hidden"
        }`}
      >
        {/* Curved Border Container matching exact reference outline, suspended in middle */}
        <div className="flex flex-col justify-between my-auto h-full max-h-[840px] w-full border-t border-r border-b border-zinc-700/80 rounded-tr-[38px] sm:rounded-tr-[44px] rounded-br-[38px] sm:rounded-br-[44px] bg-black p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="flex flex-col gap-6">
            {/* Top Actions: Search Chats & New Chat */}
            <div className="flex flex-col gap-2.5">
              {/* Search Chats trigger / Seamless text input */}
              {isSearchOpen ? (
                <div className="relative flex items-center justify-between py-1">
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-base sm:text-lg font-normal text-white placeholder-zinc-500 focus:outline-none p-0 pr-6 tracking-tight"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="absolute right-0 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                    title="Close search"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="group flex items-center justify-between text-left text-base sm:text-lg font-normal text-white hover:text-zinc-300 transition-colors py-1 cursor-pointer"
                >
                  <span className="tracking-tight">Search Chats</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}

              {/* New Chat Button */}
              <button
                onClick={() => {
                  createNewChat(true);
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className="flex items-center text-left text-base sm:text-lg font-normal text-white hover:text-zinc-300 transition-colors py-1 cursor-pointer"
              >
                <span className="tracking-tight">New chat</span>
              </button>
            </div>

            {/* Recent Chats Section matching exact reference typography */}
            <div className="pt-3 flex flex-col gap-3">
              <h3 className="text-sm sm:text-base font-normal text-zinc-400 tracking-tight">
                Recent Chats
              </h3>

              {/* List of Chats */}
              {user ? (
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(85dvh-280px)] pr-1 custom-scrollbar">
                  {filteredSessions.map((session) => {
                    const isActive = session.id === activeSessionId && isCurrentSessionSaved;
                    return (
                      <div
                        key={session.id}
                        onClick={() => {
                          handleSelectSession(session.id);
                          if (typeof window !== "undefined" && window.innerWidth < 768) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`group relative flex items-center justify-between rounded-lg py-1 text-base sm:text-lg font-normal transition-colors cursor-pointer ${
                          isActive
                            ? "text-white font-medium"
                            : "text-zinc-300 hover:text-white"
                        }`}
                      >
                        <span className="truncate pr-2 tracking-tight">{session.title}</span>

                        {/* Delete session button on hover */}
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {filteredSessions.length === 0 && (
                    <p className="text-xs text-zinc-500 py-2">No saved chats yet.</p>
                  )}
                </div>
              ) : (
                /* Unauthenticated state info in sidebar */
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 text-xs text-zinc-400 space-y-2.5">
                  <p className="leading-relaxed">
                    Chat history is saved only when you are signed in.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors cursor-pointer w-fit"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in to save</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Back Button and User State */}
          <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to website</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CHAT AREA */}
      <main className="relative flex flex-col justify-center flex-1 h-full bg-black min-w-0 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col justify-between my-auto h-full max-h-[840px] w-full min-w-0">
          {/* Top Header Bar: Controls beside container start + Studio Logo and User Button on top right */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pb-3 shrink-0">
            {/* Controls beside container start: Arrow button and New Chat icon beneath */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="group w-9 h-9 rounded-full text-white hover:text-zinc-300 hover:bg-zinc-900/60 transition-all cursor-pointer flex items-center justify-center"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={isSidebarOpen ? "Hide chat sessions" : "Show chat sessions"}
              >
                <ArrowLeft
                  className={`w-5 h-5 stroke-[2.2] transition-transform duration-300 ${
                    isSidebarOpen ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>

              {/* When chat session container is closed, show New Chat icon beside the arrow */}
              {!isSidebarOpen && (
                <button
                  onClick={() => createNewChat(true)}
                  className="group w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all cursor-pointer flex items-center justify-center active:scale-95 animate-fadeIn"
                  aria-label="New chat"
                  title="New chat"
                >
                  <SquarePen className="w-4 h-4 stroke-[2] text-zinc-300 group-hover:text-white" />
                </button>
              )}
            </div>

            {/* Header Right: Brand Logo + User Auth Icon + Navigation Menu Icon */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Studio Logo */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToHome();
                }}
                className="flex items-center transition-opacity hover:opacity-85 focus:outline-none cursor-pointer py-1 mr-1"
                aria-label="Back to home"
                title="Back to home"
              >
                <div className="relative h-7 sm:h-8 md:h-9 w-18 sm:w-20 md:w-24 flex items-center">
                  <img
                    src="https://i.ibb.co/Mxwyd6vs/WOVN-STUDIO-GRID-3.png"
                    alt="WOVN STUDIO"
                    className="h-full w-auto object-contain"
                    loading="eager"
                  />
                </div>
              </a>

              {/* User Auth: JUST ICON */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="relative w-9 h-9 text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors cursor-pointer flex items-center justify-center rounded-full group"
                    aria-label="User menu"
                    title={user.displayName || user.email || "Account"}
                    id="chat-user-menu-btn"
                  >
                    <div className="relative flex items-center justify-center">
                      <User className="w-4 h-4 text-zinc-300 group-hover:text-white transition-transform group-hover:scale-105" />
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal("login")}
                    className="relative w-9 h-9 text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors cursor-pointer flex items-center justify-center rounded-full group"
                    aria-label="Sign in"
                    title="Sign in"
                    id="chat-login-btn"
                  >
                    <User className="w-4 h-4 text-zinc-300 group-hover:text-white transition-transform group-hover:scale-105" />
                  </button>
                )}

                {/* Dropdown for signed in user */}
                {isUserMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <p className="text-xs font-semibold text-white truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer text-left text-xs font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Menu Trigger Icon */}
              <button
                type="button"
                onClick={() => setIsNavMenuOpen((prev) => !prev)}
                className="relative w-9 h-9 text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors cursor-pointer flex items-center justify-center rounded-full group"
                aria-label={isNavMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                title={isNavMenuOpen ? "Close menu" : "Menu"}
                id="chat-nav-menu-btn"
              >
                <div className="relative w-4 h-3 flex flex-col justify-between items-center pointer-events-none">
                  <span
                    className={`block h-0.5 w-4 bg-zinc-200 rounded-full transition-transform duration-300 ${
                      isNavMenuOpen ? "rotate-45 translate-y-[5px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-4 bg-zinc-200 rounded-full transition-opacity duration-200 ${
                      isNavMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-4 bg-zinc-200 rounded-full transition-transform duration-300 ${
                      isNavMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Message Stream Area: Centered column leaving generous space on left & right */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex flex-col custom-scrollbar min-h-0">
            <div className="w-full max-w-2xl lg:max-w-[720px] mx-auto flex flex-col gap-6 sm:gap-7 flex-1">
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="group flex flex-col items-end w-full">
                      {/* Exact pill-rounded white user bubble matching reference */}
                      <div className="max-w-[90%] sm:max-w-[80%] rounded-full bg-white text-black px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-normal tracking-tight shadow-md select-text break-words">
                        {msg.text}
                      </div>
                      {/* Small copy icon below user chat that shows on hover */}
                      <div className="flex items-center gap-1 mt-1 pr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/80 transition-colors cursor-pointer"
                          title={copiedMessageId === msg.id ? "Copied!" : "Copy message"}
                          aria-label="Copy message"
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="group flex flex-col items-start w-full">
                    {/* Left-aligned clean text matching reference layout with Shadcn formatting */}
                    <div className="max-w-[95%] sm:max-w-[88%] text-white text-sm sm:text-base md:text-lg font-normal leading-relaxed tracking-tight select-text space-y-2 break-words">
                      <FormattedMessage content={msg.text} />
                    </div>
                    {/* Small copy icon below AI chat that shows on hover */}
                    <div className="flex items-center gap-1 mt-1 pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/80 transition-colors cursor-pointer"
                        title={copiedMessageId === msg.id ? "Copied!" : "Copy response"}
                        aria-label="Copy response"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {isAiTyping && (
                <div className="flex justify-start w-full">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-sm py-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-2" />
            </div>
          </div>

          {/* BOTTOM INPUT BAR: Aligned with the bottom line of the session container */}
          <div className="w-full px-4 sm:px-8 md:px-12 pt-2 shrink-0">
            <div className="w-full max-w-2xl lg:max-w-[720px] mx-auto">
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center w-full rounded-full border border-zinc-700/80 bg-black px-4 sm:px-6 py-2.5 sm:py-3.5 focus-within:border-zinc-400 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Anything"
                  className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none pr-3 sm:pr-4"
                />

                {/* Circular Send Arrow Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isAiTyping}
                  className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full shrink-0 transition-transform ${
                    inputValue.trim() && !isAiTyping
                      ? "bg-white text-black hover:scale-105 active:scale-95 cursor-pointer"
                      : "bg-white text-black opacity-80 cursor-default"
                  }`}
                  aria-label="Send message"
                >
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile & Desktop Navigation Curved Drawer Menu */}
      <AnimatePresence mode="wait">
        {isNavMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsNavMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />
            <CurvedNavbar
              setIsActive={setIsNavMenuOpen}
              navItems={[
                {
                  heading: "Home",
                  href: "#hero-top",
                  onClick: () => {
                    setIsNavMenuOpen(false);
                    if (onNavigate) onNavigate("home");
                    else onBackToHome();
                  },
                },
                {
                  heading: "Work",
                  href: "#our-work",
                  onClick: () => {
                    setIsNavMenuOpen(false);
                    if (onNavigate) onNavigate("our-work");
                    else {
                      onBackToHome();
                      setTimeout(() => {
                        document.getElementById("our-work")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  },
                },
                {
                  heading: "Services",
                  href: "#services",
                  onClick: () => {
                    setIsNavMenuOpen(false);
                    if (onNavigate) onNavigate("home");
                    else onBackToHome();
                    setTimeout(() => {
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  },
                },
                {
                  heading: "Chat",
                  href: "#chat",
                  onClick: () => {
                    setIsNavMenuOpen(false);
                  },
                },
                {
                  heading: "Contact",
                  href: "#contact",
                  onClick: () => {
                    setIsNavMenuOpen(false);
                    if (onNavigate) onNavigate("contact");
                    else {
                      onBackToHome();
                      setTimeout(() => {
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  },
                },
              ]}
              theme={theme}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
